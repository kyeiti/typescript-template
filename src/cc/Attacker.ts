import {NS} from "@ns";
import {Script} from "/cc/Script";
import {Attack} from "/cc/config";
import {Target} from "/cc/Target";

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

    getAvailableThreadsFor(script: Script) {
        return Math.floor(this.availableRam / this.ns.getScriptRam(script.name, this.name));
    }
}