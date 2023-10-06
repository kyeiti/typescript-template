import {NS} from "@ns";

class PortCracker {
    constructor(
        public readonly requiredFile: string,
        readonly usedFunction: (ns: NS) => (server: string) => void
    ) {
    }

    crack(ns: NS, server: string) {
        this.usedFunction(ns)(server);
    }
}

export const PORTS: { [key: string]: PortCracker } = {
    SSH:  new PortCracker('BruteSSH.exe', (ns) => (server) => ns.brutessh(server)),
    FTP:  new PortCracker('FTPCrack.exe', (ns) => (server) => ns.ftpcrack(server)),
    SMTP: new PortCracker( 'relaySMTP.exe', (ns) => (server) => ns.relaysmtp(server)),
    HTTP: new PortCracker( 'HTTPWorm.exe', (ns) => (server) => ns.httpworm(server)),
    SQL:  new PortCracker('SQLInject.exe', (ns) => (server) => ns.sqlinject(server)),
}

/** @param {NS} ns */
export function getAvailablePortCrackers(ns: NS) {
    const availableCrackers = [];
    for (const port in PORTS) {
        const cracker = PORTS[port];
        if (ns.fileExists(cracker.requiredFile)) {
            availableCrackers.push(cracker)
        }
    }
    return availableCrackers;
}