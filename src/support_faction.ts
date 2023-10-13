import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/util/args'
import {Receiver} from "/cc/Receiver";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['host', ''],
        ['threads', 0],
    ]);
    const receiver = new Receiver(ns, <string>argv['host']);


    const result = await ns.share();
    receiver.tell({
        action: "share",
        host: <string>argv['host'],
        threads: <number>argv['threads'],
    })
}