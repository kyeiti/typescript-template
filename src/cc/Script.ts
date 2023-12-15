import {Arg} from "/cc/args";
import {NS, ScriptArg} from "@ns";
import {IAttacker, ITarget} from "/cc/IServer";
import {IScript} from "/cc/IScript";

export class Script implements IScript {
    private static defaultTarget = "n00dles";

    constructor(
        public readonly name: string,
        private readonly dependencies: string[] = [],
        public readonly args: Arg[] = []
    ) {
    }

    get neededFiles() {
        return [this.name, ...this.dependencies]
    }

    deployTo(ns: NS, target: string) {
        ns.scp(this.neededFiles, target)
    }

    run(ns: NS, attacker: IAttacker, threadsToUse: number, target?: ITarget, additionalArgs?: readonly ScriptArg[]) {
        this.deployTo(ns, attacker.name);
        const maxRam = ns.getServerMaxRam(attacker.name);
        const scriptRam = ns.getScriptRam(this.name, attacker.name);
        const usedRam = ns.getServerUsedRam(attacker.name)
        const availableRam = maxRam - usedRam;

        const availableThreads = attacker.getAvailableThreadsForScript(this.name);

        let usedThreads = 0;
        const expectedThreads = threadsToUse >= availableThreads ? availableThreads : threadsToUse

        if (expectedThreads < 1) {
            return {
                started: false,
                script: this,
                attacker: attacker.name,
                target: target,
                threads: 0,
                scriptRAM: scriptRam,
                usedRAM: 0,
                remainingRAM: availableRam
            }
        }

        const pid = ns.exec(this.name, attacker.name, expectedThreads, ...this.getArgsWithValues(attacker.name, expectedThreads, target), ...(additionalArgs ?? []));
        if (pid > 0) {
            const process = ns.ps(attacker.name).filter((p) => p.pid === pid)[0];
            usedThreads = process.threads
        }
        return {
            started: true,
            script: this,
            attacker: attacker.name,
            target: target,
            threads: usedThreads,
            scriptRAM: scriptRam,
            usedRAM: scriptRam * usedThreads,
            remainingRAM: availableRam - scriptRam * usedThreads
        };
    }

    private getArgsWithValues(attacker: string, threads: number, target: ITarget | null = null) {
        const args: (string | number)[] = [];
        for (const arg of this.args) {
            args.push('--' + arg)
            args.push(this.getValueForArg(arg, attacker, threads, target))
        }
        return args;
    }

    private getValueForArg(arg: Arg, attacker: string, threads: number, target: ITarget | null = null) {
        switch (arg) {
            case 'target':
                return target?.name ?? Script.defaultTarget;
            case 'host':
                return attacker
            case 'threads':
                return threads
            default:
                return "";
        }
    }
}