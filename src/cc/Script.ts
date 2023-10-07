import {Arg} from "/util/args";
import {NS} from "@ns";
import {Target} from "/cc/Target";

export class Script {
    private static defaultTarget = "n00dles";
    constructor(
        public readonly name: string,
        public readonly args: Arg[] = []
    ) {
    }

    start(ns: NS, attacker: string, target: string | null = null) {
        const maxRam = ns.getServerMaxRam(attacker);
        const scriptRam = ns.getScriptRam(this.name, attacker);

        if(maxRam === 0) {
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
            ns.exec(this.name, attacker, threads, ...this.getArgsWithValues(ns, target ?? attacker));
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

    run(ns: NS, attacker: {name: string, threads: number}, target: Target, threadsToUse: number) {
        const maxRam = ns.getServerMaxRam(attacker.name);
        const scriptRam = ns.getScriptRam(this.name, attacker.name);
        const usedRam = ns.getServerUsedRam(attacker.name)
        const availableRam = maxRam - usedRam;

        if(maxRam < scriptRam) {
            return {
                started: false,
                script: this,
                server: attacker.name,
                target: target,
                threads: 0,
                scriptRAM: scriptRam,
                usedRAM: 0,
                remainingRAM: availableRam
            }
        }

        const availableThreads = attacker.threads;

        let usedThreads = 0;
        const pid = ns.exec(this.name, attacker.name, threadsToUse >= availableThreads ? availableThreads :threadsToUse, ...this.getArgsWithValues(ns, target.name));
        if (pid > 0) {
            const process = ns.ps(attacker.name).filter((p) => p.pid === pid)[0];
            usedThreads = process.threads
        }
        return {
            started: true,
            script: this,
            server: attacker.name,
            target: target,
            threads: usedThreads,
            scriptRAM: scriptRam,
            usedRAM: scriptRam * usedThreads,
            remainingRAM: availableRam - scriptRam * usedThreads
        };
    }

    private getArgsWithValues(ns: NS, target:string|null = null) {
        const args: (string|number)[] = [];
        for (const arg of this.args) {
            args.push('--' + arg)
            args.push(this.getValueForArg(ns, arg, target))
        }
        return args;
    }

    private getValueForArg(ns: NS, arg: Arg, server: string|null = null) {
        if (!server) {
            server = Script.defaultTarget;
        }
        switch (arg) {
            case 'target':
                return server;
            case 'maxMoney':
                return ns.getServerMaxMoney(server);
            case 'minSecurity':
                return ns.getServerMinSecurityLevel(server);
            case 'currentSecurity':
                return ns.getServerSecurityLevel(server);
            case 'currentMoney':
                return ns.getServerMoneyAvailable(server);
            default:
                return "";
        }
    }
}