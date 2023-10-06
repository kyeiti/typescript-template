import {Arg} from "/util/args";
import {NS} from "@ns";

export class Script {
    private static defaultTarget = "n00dles";
    constructor(
        public readonly name: string,
        public readonly args: Arg[] = [],
        public readonly weight: number = 1
    ) {
    }

    start(ns: NS, server: string, target: string | null, cOtherScriptsToStart: number) {
        const weight = cOtherScriptsToStart > 1 ? this.weight / cOtherScriptsToStart : 1;
        const maxRam = ns.getServerMaxRam(server);
        const scriptRam = ns.getScriptRam(this.name, server);

        if(maxRam === 0) {
            return {
                started: false,
                threads: 0,
                scriptRAM: scriptRam,
                usedRAM: 0,
                remainingRAM: 0
            }
        }

        const usedRam = ns.getServerUsedRam(server)
        const availableRam = maxRam - usedRam;
        const threads = Math.floor(availableRam / scriptRam * weight);
        if (threads > 0) {
            ns.exec(this.name, server, threads, ...this.getArgsWithValues(ns, target ?? server));
            return {
                started: true,
                threads: threads,
                scriptRAM: scriptRam,
                usedRAM: scriptRam * threads,
                remainingRAM: availableRam - scriptRam * threads
            };
        } else {
            return {
                started: false,
                threads: threads,
                scriptRAM: scriptRam,
                usedRAM: 0,
                remainingRAM: availableRam,
            };
        }
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