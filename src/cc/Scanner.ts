import {NS} from "@ns";
import {isServerHackable} from "/util/functions";
import {getAvailablePortCrackers} from "/util/ports";

export class Scanner {

    constructor(private readonly ns: NS) {
    }

    get all(): string[] {
        const scans = this.ns.scan();
        for (const server of scans) {
            scans.push(...this.ns.scan(server).filter(s => !scans.includes(s)));
        }
        return scans;
    }

    get accessible(): string[] {
        return this.all.filter((s) => this.ns.hasRootAccess(s));
    }

    get hackable(): string[] {
        return this.all.filter((s) => isServerHackable(this.ns, s));
    }

    get targets(): string[] {
        return this.accessible.filter((s) => this.ns.getServerMaxMoney(s) > 0);
    }

    get attackers(): string[] {
        return this.accessible.filter((s) => this.ns.getServerMaxRam(s) > 0);
    }

    public isServerHackable(server: string) {
        if (this.ns.hasRootAccess(server)) {
            return false;
        }
        if (this.ns.getServerRequiredHackingLevel(server) <= this.ns.getHackingLevel()) {
            if (this.ns.getServerNumPortsRequired(server) <= getAvailablePortCrackers(this.ns).length) {
                return true;
            }
        }
        return false;
    }
}