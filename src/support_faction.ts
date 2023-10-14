import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/util/args'
import {Reporter} from "/cc/Reporter";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['host', ''],
        ['threads', 0],
    ]);
    const reporter = new Reporter(ns, <string>argv['host']);

    const result = await ns.share();
    reporter.tell({
        action: "share",
        host: <string>argv['host'],
        threads: <number>argv['threads'],
    })
}