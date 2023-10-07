import {NS} from "@ns";

export class Attacker {

    constructor(
        private readonly ns: NS,
        public readonly name: string) {
    }

    get availableRam() {
        return this.maxRam - this.usedRam
    }

    get usedRam() {
        return this.ns.getServerUsedRam(this.name);
    }

    get maxRam() {
        return this.ns.getServerMaxRam(this.name);
    }
}