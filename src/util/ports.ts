import {NS} from "@ns";

type portCrackerFunction = {
    [K in keyof NS]: NS[K] extends (server: string) => void ? K : never;
}[keyof NS];

class PortCracker {
    constructor(
        public readonly requiredFile: string,
        private readonly functionName: portCrackerFunction
    ) {
    }

    crack(ns: NS, server: string) {
        ns[this.functionName](server);
    }
}

export const PORTS = [
    new PortCracker('BruteSSH.exe', 'brutessh'),
    new PortCracker('FTPCrack.exe', 'ftpcrack'),
    new PortCracker('relaySMTP.exe', 'relaysmtp'),
    new PortCracker('HTTPWorm.exe', 'httpworm'),
    new PortCracker('SQLInject.exe', 'sqlinject'),
];

/** @param {NS} ns */
export function getAvailablePortCrackers(ns: NS) {
    return PORTS.filter(cracker => ns.fileExists(cracker.requiredFile));
}