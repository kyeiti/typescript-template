export const PORTS = {
    COMMANDER_SEND: 1,
    COMMANDER_RECEIVE: 2
}

export const waitTime = 1000 // milliseconds
export const weakenTimeLimit = 4200;
export const growTimeLimit = 1000;
export const hackTimeLimit = 600;

export const attackersToSkip = ["home"]

export type Action = "weaken" | "grow" | "hack"

export const actions = ["grow", "weaken", "hack"] as Action[]

export type Command = {
    receiver: string,
    action: Action,
    target: string,
}

type BaseCommandResult = {
    action: Action,
    host: string,
    target: string,
    threads: number,
}

type WeakenResult = BaseCommandResult & {
    action: "weaken",
    weakenedByAbs: number,
}

type GrowResult =  BaseCommandResult & {
    action: "grow",
    grownByPct: number,
}

type HackResult =  BaseCommandResult & {
    action: "hack",
    hackedForAbs: number,
}

export type CommandResult = WeakenResult | GrowResult | HackResult