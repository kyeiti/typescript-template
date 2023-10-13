import {Script} from "/cc/Script";

export const PORTS = {
    COMMANDER_SEND: 1,
    COMMANDER_RECEIVE: 2
}

export const waitTime = 1000 // milliseconds
export const weakenTimeLimit = 4200;
export const growTimeLimit = 1000;
export const hackTimeLimit = 600;

export const allowedRaisedSecurity = 1;
export const growthLimit = 0.9;
export const pctToHack = 0.11;
export const attackTimeAllowedOnRaisedSecurity = 10 // seconds

export const attackersToSkip = [
    "home"
]

export const targetsToSkip = [
    "rho-construction"
]

export const actionScripts: {[key in Action]: Script} = {
    hack: new Script('single_hack.js', ['target', 'host', 'threads']),
    weaken: new Script('single_weaken.js', ['target', 'host', 'threads']),
    grow: new Script('single_grow.js', ['target', 'host', 'threads']),
    share: new Script('support_faction.js', []),
}


export type Attack = "weaken" | "grow" | "hack"

export type Action = Attack | "share"
export const attacks = ["grow", "weaken", "hack"] as Attack[]

export type Command = {
    receiver: string,
    action: Action,
    target: string,
}

type BaseCommandResult = {
    action: Action,
    host: string,
    threads: number,
}

type BaseAttackCommandResult =  BaseCommandResult  & {
    target: string,
}

type ShareResult = BaseCommandResult & {
    action: "share"
}

type WeakenResult = BaseAttackCommandResult & {
    action: "weaken",
    weakenedByAbs: number,
}

type GrowResult =  BaseAttackCommandResult & {
    action: "grow",
    grownByPct: number,
}

type HackResult =  BaseAttackCommandResult & {
    action: "hack",
    hackedForAbs: number,
}

export type AttackResult = WeakenResult | GrowResult | HackResult

export type CommandResult = AttackResult | ShareResult