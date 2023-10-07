import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/util/args'
import {Receiver} from "/cc/Receiver";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['target', ''],
    ]);
    const server = <string>argv['target']
    const receiver = new Receiver(ns, server);

    const result = await ns.weaken(server);
    receiver.tell({
        action: "weaken",
        target: server,
        weakenedByAbs: result,
        host: ns.getHostname(),
    })
}