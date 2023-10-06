import {NS} from "@ns";
import {isServerHackable} from "/util/functions";

export function getAllServers(ns: NS) {
    const scans = ns.scan();
    for (const server of scans) {
        scans.push(...ns.scan(server).filter(s => !scans.includes(s)));
    }
    return scans;
}

export function collectAccessibleServers(ns: NS) {
    return getAllServers(ns).filter((s) =>  ns.hasRootAccess(s));
}

/**
 * @param {NS} ns
 * @returns string[]
 */
export function collectHackableServers(ns: NS) {
    return getAllServers(ns).filter((s) => isServerHackable(ns, s));
}