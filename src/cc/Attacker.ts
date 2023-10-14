import {NS, ScriptArg} from "@ns";
import {Target} from "/cc/Target";
import {actionScripts} from "/cc/scriptConfig";
import {Action, Attack} from "/cc/types";
import {IAttacker, ITarget} from "/cc/IServer";
import {ScriptResult} from "/cc/IScript";

export class Attacker implements IAttacker{

    constructor(
        private readonly ns: NS,
        public readonly name: string) {
    }

    get availableRam() {
        return this.maxRam - this.usedRam
    }

    get usedRam() {
        return this.ns.getServerUsedRam(this.name);
    }

    get maxRam() {
        return this.ns.getServerMaxRam(this.name);
    }

    getAvailableThreadsForScript(script: string) {
        return Math.floor(this.availableRam / this.ns.getScriptRam(script, this.name));
    }

    getAvailableThreadsForAction(action: Action) {
        return Math.floor(this.availableRam / this.ns.getScriptRam(actionScripts[action].name, this.name));
    }

    attack(action: Attack, target: ITarget, withThreads: number, additionalArgs?: ScriptArg[]) {
        const result = actionScripts[action].run(this.ns, this, target, withThreads, additionalArgs ?? []);
        if(result.threads > 0) {
            target.addAttacker(action, this, result.threads);
        }
        return result
    }

    shareThreadsWithFaction(threads?: number): ScriptResult {
        const availableThreads = this.getAvailableThreadsForAction("share")
        if(availableThreads < 1) {
            return {
                started: false,
                script: actionScripts["share"],
                attacker: this.name,
                target: new Target(this.ns, ""),
                threads: 0,
                scriptRAM: 0,
                usedRAM: 0,
                remainingRAM: this.availableRam,
            }
        }
        if (threads === undefined) {
            threads = availableThreads;
        }
        return actionScripts["share"].run(this.ns, this, new Target(this.ns, ""), threads > availableThreads ? availableThreads : threads)
    }
}