import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/util/args'
import {Receiver} from "/cc/Receiver";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['target', ''],
    ]);
    const server = <string>argv['target']
    const receiver = new Receiver(ns, server);

    const result = await ns.hack(server);
    receiver.tell({
        action: "hack",
        target: server,
        hackedForAbs: result,
        host: ns.getHostname(),
    })
}