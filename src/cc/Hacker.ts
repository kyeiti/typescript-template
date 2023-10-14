import {NS} from "@ns";
import {Scanner} from "/cc/Scanner";

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


export class Hacker {
    readonly PORT_CRACKERS: readonly PortCracker[] = [
        new PortCracker('BruteSSH.exe', 'brutessh'),
        new PortCracker('FTPCrack.exe', 'ftpcrack'),
        new PortCracker('relaySMTP.exe', 'relaysmtp'),
        new PortCracker('HTTPWorm.exe', 'httpworm'),
        new PortCracker('SQLInject.exe', 'sqlinject'),
    ];

    constructor(private readonly ns: NS, private readonly scanner: Scanner) {
    }

    hackServers() {
        const servers = this.scanner.all.filter((s) => this.isServerHackable(s))
        for (const server of servers) {
            this.hackServer(server);
        }
        return servers
    }

    private isServerHackable(server: string) {
        if (this.ns.hasRootAccess(server)) {
            return false;
        }
        if (this.ns.getServerRequiredHackingLevel(server) <= this.ns.getHackingLevel()) {
            if (this.ns.getServerNumPortsRequired(server) <= this.getAvailablePortCrackers(this.ns).length) {
                return true;
            }
        }
        return false;
    }

    private hackServer(server: string) {
        const crackers = this.getAvailablePortCrackers(this.ns);
        for (const cracker of crackers) {
            cracker.crack(this.ns, server);
        }
        this.ns.nuke(server);
        if (this.ns.getScriptRam('controlled/backdoor.js') <= this.ns.getServerMaxRam(server)) {
            this.ns.scp('controlled/backdoor.js', server);
//    this.ns.exec('controlled/backdoor.js', server);
        }
    }

    /** @param {NS} ns */
    private getAvailablePortCrackers(ns: NS) {
        return this.PORT_CRACKERS.filter(cracker => ns.fileExists(cracker.requiredFile));
    }
}