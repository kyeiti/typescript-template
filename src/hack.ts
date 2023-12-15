import {NS} from "@ns";
import {Hacker} from "/cc/Hacker";
import {Scanner} from "/cc/Scanner";

const serversToBackdoor = [
    // factions
    'CSEC',
    'I.I.I.I',
    'avmnite-02h',
    'run4theh111z',
    'fulcrumassets',

    // world daemon
    'w0r1d_d43m0n',
]

export async function main(ns: NS) {
    ns.disableLog('ALL');
    ns.enableLog('singularity.installBackdoor');
    const scanner = new Scanner(ns);
    const hacker = new Hacker(ns, scanner);
    do {
        run(ns.printf, hacker)
        console.log(scanner.accessible.filter(s => serversToBackdoor.includes(s)))
        await hacker.installBackdoors(scanner.accessible.filter(s => serversToBackdoor.includes(s)));
        await ns.sleep(10000);
    } while (scanner.inaccessible.length > 0);
}

function run(printer: (fmt: string, ...args: any[]) => void, hacker: Hacker) {
    const hackResult = hacker.hackServers()
    for (const server of hackResult) {
        printer('[%s] Hacked %s', new Date().toISOString(), server);
    }
}
