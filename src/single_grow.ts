import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/util/args'
import {Receiver} from "/cc/Receiver";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['target', ''],
    ]);
    const server = <string>argv['target']
    const receiver = new Receiver(ns, server);

    const result = await ns.grow(server);
    receiver.tell({
        action: "grow",
        target: server,
        grownByPct: result,
        host: ns.getHostname(),
    })
}