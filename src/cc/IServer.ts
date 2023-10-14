import {Action, Attack, AttackResult} from "/cc/types";
import {ScriptArg} from "@ns";
import {ScriptResult} from "/cc/IScript";

export interface IAttacker {
    name: string
    availableRam: number
    usedRam: number
    maxRam: number

    getAvailableThreadsForScript: (script: string) => number
    getAvailableThreadsForAction: (action: Action) => number

    attack: (action: Attack, target: ITarget, withThreads: number, additionalArgs?: ScriptArg[]) => ScriptResult
    shareThreadsWithFaction: (threads?: number) => ScriptResult
}

export interface ITarget {
    name: string
    actionsToExecute: Attack[]
    runningActions: Attack[]

    threadsNeeded: (action: Attack) => number
    timeNeeded: (action: Attack) => number
    shouldReceiveAttack: (action: Attack) => boolean
    addAttacker: (action: Attack, attacker: IAttacker, threads: number) => void
    attackFinished: (result: AttackResult) => void
}

export interface ITargetWithStatistics extends ITarget {
    maxMoney: number
    availableMoney: number

    securityLevel: number
    minSecurityLevel: number

    threadsToWeaken: number
    threadsToGrow: number
    threadsToHack: number

    timeToHack: number
    timeToWeaken: number
    timeToGrow: number

    isGettingWeakenedBy: number
    isGettingGrownBy: number
    isGettingHackedBy: number

    growthPct: number
}