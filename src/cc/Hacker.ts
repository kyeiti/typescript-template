import {NS} from "@ns";
import {Scanner} from "/cc/Scanner";
import {connect} from "/util/connect";

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

    isServerHackable(server: string) {
        if (this.ns.hasRootAccess(server)) {
            return false;
        }
        if (this.ns.getServerRequiredHackingLevel(server) <= this.ns.getHackingLevel()) {
            while (this.ns.getServerNumPortsRequired(server) > this.getAvailablePortCrackers().length && this.purchaseNextPortCracker()) ;
            if (this.ns.getServerNumPortsRequired(server) <= this.getAvailablePortCrackers().length) {
                return true;
            }
        }
        return false;
    }

    public async installBackdoors(servers: string[]|null = null) {
        if (servers === null) {
            servers = this.scanner.accessible
        }
        const backdoorLessServers = servers.filter(s => this.ns.hasRootAccess(s) && !this.ns.getServer(s).backdoorInstalled && !this.ns.getServer(s).purchasedByPlayer)
        for (const server of backdoorLessServers) {
            connect(this.ns, server);
            await this.ns.singularity.installBackdoor();
        }
        this.ns.singularity.connect("home");
    }

    private hackServer(server: string) {
        const crackers = this.getAvailablePortCrackers();
        for (const cracker of crackers) {
            cracker.crack(this.ns, server);
        }
        this.ns.nuke(server);
    }

    private purchaseNextPortCracker() {
        const missingCrackers = this.PORT_CRACKERS.filter(cracker => !this.ns.fileExists(cracker.requiredFile))
        if (missingCrackers.length === 0) {
            return false;
        }
        if (!this.ns.singularity.purchaseTor()) {
            return false;
        }
        return this.ns.singularity.purchaseProgram(missingCrackers[0].requiredFile);

    }

    private getAvailablePortCrackers() {
        return this.PORT_CRACKERS.filter(cracker => this.ns.fileExists(cracker.requiredFile));
    }
}