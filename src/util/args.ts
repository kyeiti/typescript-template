import {ScriptArg} from "@ns";

export type Arg = 'target' |
    'maxMoney' |
    'currentMoney' |
    'minSecurity' |
    'currentSecurity' |
    'restartAll' |
    'scripts' |
    'host' |
    'threads' |
    "port"
    ;

export type ArgFlags = Partial<{[key in Arg]: ScriptArg}>

export type ArgFlagArg = [Arg, ScriptArg][];