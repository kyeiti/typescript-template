export const PORTS = {
    COMMANDER_SEND: 1,
    COMMANDER_RECEIVE: 2
}

export const waitTime = 1000 // milliseconds
export const weakenTimeLimit = 4200;
export const growTimeLimit = 1000;
export const hackTimeLimit = 600;

export const attackersToSkip = [
    "home"
]

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