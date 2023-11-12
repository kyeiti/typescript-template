import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/cc/args'

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['host', ''],
        ['threads', 0],
    ]);

    await ns.share();
}