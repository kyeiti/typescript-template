import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/cc/args'
import {Reporter} from "/port/Reporter";
import {PORTS} from "/cc/config";

export async function main(ns: NS) {
    const argv: ArgFlags = ns.flags(<ArgFlagArg>[
        ['target', ''],
        ['host', ''],
        ['threads', 0],
        ['port', PORTS.COMMANDER_RECEIVE]
    ]);
    const server = <string>argv['target']
    const reporter = new Reporter(ns, <number>argv['port']);

    const result = await ns.hack(server);
    reporter.tell({
        action: "hack",
        target: server,
        hackedForAbs: result,
        host: <string>argv['host'],
        threads: <number>argv['threads'],
    })
}