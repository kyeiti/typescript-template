import {NS, ScriptArg} from "@ns";
import {IAttacker, ITarget} from "/cc/IServer";

export interface ScriptResult {
    started: boolean,
    script: IScript,
    attacker: string,
    target?: ITarget,
    threads: number,
    scriptRAM: number,
    usedRAM: number,
    remainingRAM: number
}

export interface IScript {
    neededFiles: string[];
    run: (ns: NS, attacker: IAttacker, threadsToUse: number, target?: ITarget, additionalArgs?: readonly ScriptArg[]) => ScriptResult;
}