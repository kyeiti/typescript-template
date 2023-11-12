import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/cc/args'

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['target', ''],
        ['host', ''],
        ['threads', 0],
    ]);
    const server = <string>argv['target']

    await ns.weaken(server);
}