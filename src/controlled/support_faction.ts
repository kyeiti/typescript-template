import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/util/args'
import {Reporter} from "/port/Reporter";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['host', ''],
        ['threads', 0],
    ]);
    const reporter = new Reporter(ns, <number>argv['port']);

    const result = await ns.share();
    if(reporter.hasData()) {
        return;
    }
    reporter.tell({
        action: "share",
        host: <string>argv['host'],
        threads: <number>argv['threads'],
    })
}