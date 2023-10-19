export const PORTS = {
    COMMANDER_RECEIVE: 2
}

export const waitTime = 1000 // milliseconds
export const weakenTimeLimit = 4200;
export const growTimeLimit = 1000;
export const hackTimeLimit = 600;

export const allowedRaisedSecurity = 1;
export const growthLimit = 0.95;
export const pctToHack = 0.40;
export const attackTimeAllowedOnRaisedSecurity = 10 // seconds

export const supportFactions = false;

export const attackersToSkip: readonly string[] = [
    "home"
]

export const targetsToSkipForHack: readonly string[] = [
    // "rho-construction"
]
export const targetsToSkipForGrow: readonly string[] = [
    // "rho-construction"
]

