import {NS} from "@ns";
import {isServerHackable} from "/util/functions";

export function collectAccessableServers(ns: NS) {
    const servers: string[] = [];
    const scans = ns.scan();
    for (const server of scans) {
        if (ns.hasRootAccess(server)) {
            servers.push(server);
        }
        const newScan = ns.scan(server);
        for (const scan of newScan) {
            if (!scans.includes(scan)) {
                scans.push(scan);
            }
        }
    }
    return servers;
}

/**
 * @param {NS} ns
 * @returns string[]
 */
export function collectHackableServers(ns: NS) {
    const servers: string[] = [];
    const scans = ns.scan();
    for (const server of scans) {
        if (isServerHackable(ns, server)) {
            servers.push(server);
        }
        const newScan = ns.scan(server);
        for (const scan of newScan) {
            if (!scans.includes(scan)) {
                scans.push(scan);
            }
        }
    }
    return servers;
}