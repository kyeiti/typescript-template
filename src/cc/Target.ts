import {NS} from "@ns";

type Attacker = {
    name: string,
    threads: number,
}

export class Target {
    // name of attacker => used threads
    public growers: Map<string, number> = new Map()
    public weakeners: Map<string, number> = new Map()
    public hackers: Map<string, number> = new Map();

    constructor(
        private readonly ns: NS,
        public readonly name: string) {
    }

    get timeToHack(): number {
        return this.ns.getHackTime(this.name) / 1000
    }

    get timeToWeaken(): number {
        return this.ns.getWeakenTime(this.name) / 1000
    }

    get timeToGrow(): number {
        return this.ns.getGrowTime(this.name) / 1000
    }

    get needsWeakening(): boolean {
        return this.threadsToWeaken > 0;
    }

    get needsGrowing(): boolean {
        return this.availableMoney / this.maxMoney < 0.9 && this.threadsToGrow > 0;
    }

    get maxMoney(): number {
        return this.ns.getServerMaxMoney(this.name)
    }

    get availableMoney(): number {
        return this.ns.getServerMoneyAvailable(this.name)
    }

    get securityLevel(): number {
        return this.ns.getServerSecurityLevel(this.name)
    }

    get minSecurityLevel(): number {
        return this.ns.getServerMinSecurityLevel(this.name);
    }

    get growthPct(): number {
        return this.ns.getServerGrowth(this.name)
    }

    get threadsToWeaken(): number {
        const threads = (this.securityLevel - this.minSecurityLevel) / 0.05
        return Math.ceil(threads - [...this.weakeners.values()].reduce((p, c) => p + c, 0));
    }

    get threadsToGrow(): number {
        const moneyToGeneratePct = 100 - this.maxMoney / this.availableMoney;
        if (this.availableMoney === 0 || moneyToGeneratePct < 1) {
            return 0;
        }
        return Math.ceil(this.ns.growthAnalyze(this.name, moneyToGeneratePct)) - [...this.growers.values()].reduce((p, c) => p + c, 0);
    }

    get threadsToHack(): number {
        return Math.floor(this.ns.hackAnalyzeThreads(this.name, this.availableMoney * 0.1)) - [...this.hackers.values()].reduce((p, c) => p + c, 0);
    }

    get hasFreeHackingSlots() {
        return this.hackers.size === 0
    }

    addHacker(hacker: Attacker) {
        this.hackers.set(hacker.name, (this.hackers.get(hacker.name) ?? 0) + hacker.threads)
    }

    removeHacker(hacker: string) {
        this.hackers.delete(hacker);
    }

    addWeakener(weakener: Attacker) {
        this.weakeners.set(weakener.name, (this.weakeners.get(weakener.name) ?? 0) + weakener.threads)
    }

    removeWeakener(attacker: string) {
        this.weakeners.delete(attacker);
    }

    addGrower(grower: Attacker) {
        this.growers.set(grower.name, (this.growers.get(grower.name) ?? 0) + grower.threads)
    }

    removeGrower(attacker: string) {
        this.growers.delete(attacker);
    }
}