import {Arg} from "/util/args";
import {NS, ScriptArg} from "@ns";
import {IAttacker, ITarget} from "/cc/IServer";
import {IScript} from "/cc/IScript";

export class Script implements IScript {
    private static defaultTarget = "n00dles";

    constructor(
        public readonly name: string,
        public readonly args: Arg[] = []
    ) {
    }

    start(ns: NS, attacker: string, target: string | null = null) {
        const maxRam = ns.getServerMaxRam(attacker);
        const scriptRam = ns.getScriptRam(this.name, attacker);

        if (maxRam === 0) {
            return {
                started: false,
                script: this,
                server: attacker,
                threads: 0,
                scriptRAM: scriptRam,
                usedRAM: 0,
                remainingRAM: 0
            }
        }

        const usedRam = ns.getServerUsedRam(attacker)
        const availableRam = maxRam - usedRam;
        const threads = Math.floor(availableRam / scriptRam);
        if (threads > 0) {
            ns.exec(this.name, attacker, threads, ...this.getArgsWithValues(ns, attacker, threads, target ?? attacker));
            return {
                started: true,
                script: this,
                server: attacker,
                threads: threads,
                scriptRAM: scriptRam,
                usedRAM: scriptRam * threads,
                remainingRAM: availableRam - scriptRam * threads
            };
        } else {
            return {
                started: false,
                script: this,
                server: attacker,
                threads: threads,
                scriptRAM: scriptRam,
                usedRAM: 0,
                remainingRAM: availableRam,
            };
        }
    }

    deployTo(ns: NS, target: string) {
        ns.scp(this.name, target)
    }

    run(ns: NS, attacker: IAttacker, target: ITarget, threadsToUse: number, additionalArgs?: readonly ScriptArg[]) {
        this.deployTo(ns, attacker.name);
        const maxRam = ns.getServerMaxRam(attacker.name);
        const scriptRam = ns.getScriptRam(this.name, attacker.name);
        const usedRam = ns.getServerUsedRam(attacker.name)
        const availableRam = maxRam - usedRam;

        if (maxRam < scriptRam) {
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

        const availableThreads = attacker.getAvailableThreadsForScript(this.name);

        let usedThreads = 0;
        const expectedThreads = threadsToUse >= availableThreads ? availableThreads : threadsToUse
        const pid = ns.exec(this.name, attacker.name, expectedThreads, ...this.getArgsWithValues(ns, attacker.name, expectedThreads, target.name), ...(additionalArgs ?? []));
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

    private getArgsWithValues(ns: NS, attacker: string, threads: number, target: string | null = null) {
        const args: (string | number)[] = [];
        for (const arg of this.args) {
            args.push('--' + arg)
            args.push(this.getValueForArg(ns, arg, attacker, threads, target))
        }
        return args;
    }

    private getValueForArg(ns: NS, arg: Arg, attacker: string, threads: number, target: string | null = null) {
        if (!target) {
            target = Script.defaultTarget;
        }
        switch (arg) {
            case 'target':
                return target;
            case 'maxMoney':
                return ns.getServerMaxMoney(target);
            case 'minSecurity':
                return ns.getServerMinSecurityLevel(target);
            case 'currentSecurity':
                return ns.getServerSecurityLevel(target);
            case 'currentMoney':
                return ns.getServerMoneyAvailable(target);
            case 'host':
                return attacker
            case 'threads':
                return threads
            default:
                return "";
        }
    }
}