import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/cc/args'
import {PORTS} from "/cc/config";
import {Reporter} from "/port/Reporter";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['target', ''],
        ['host', ''],
        ['threads', 0],
        ['port', PORTS.COMMANDER_RECEIVE]
    ]);
    const server = <string>argv['target']
    const reporter = new Reporter(ns, <number>argv['port']);

    const result = await ns.weaken(server);
    reporter.tell({
        action: "weaken",
        target: server,
        weakenedByAbs: result,
        host: <string>argv['host'],
        threads: <number>argv['threads'],
    })
}