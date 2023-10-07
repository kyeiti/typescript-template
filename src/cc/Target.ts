import {NS} from "@ns";
import {Action} from "/cc/config";

type Attacker = {
    name: string,
    threads: number,
}

export class Target {
    // action => name of attacker => used threads
    public attackers: Map<Action, Map<string, number>> = new Map([
        ['hack', new Map()],
        ['weaken', new Map()],
        ['grow', new Map()]
    ]);

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

    get isGettingWeakend() {
        return this.attackers.get('weaken')!.size > 0
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
        return Math.ceil(threads) - [...this.attackers.get("weaken")!.values()].reduce((p, c) => p + c, 0);
    }

    get threadsToGrow(): number {
        const moneyToGeneratePct = 100 - this.maxMoney / this.availableMoney;
        if (this.availableMoney === 0 || moneyToGeneratePct < 1) {
            return 0;
        }
        return Math.ceil(this.ns.growthAnalyze(this.name, moneyToGeneratePct)) - [...this.attackers.get("grow")!.values()].reduce((p, c) => p + c, 0);
    }

    get threadsToHack(): number {
        return Math.floor(this.ns.hackAnalyzeThreads(this.name, this.availableMoney * 0.1)) - [...this.attackers.get("hack")!.values()].reduce((p, c) => p + c, 0);
    }

    get hasFreeHackingSlots() {
        return this.attackers.get('hack')?.size === 0
    }

    threadsNeeded(action: Action) {
        switch (action) {
            case "hack":
                return this.threadsToHack;
            case "weaken":
                return this.threadsToWeaken;
            case "grow":
                return this.threadsToGrow;
        }
    }

    timeNeeded(action: Action) {
        switch (action) {
            case "hack":
                return this.timeToHack;
            case "weaken":
                return this.timeToWeaken;
            case "grow":
                return this.timeToGrow;
        }
    }

    canExecuteAction(action: Action) {
        switch (action) {
            case "weaken":
                return this.needsWeakening;
            case "grow":
                return !this.needsWeakening && this.needsGrowing;
            case "hack":
                return this.hasFreeHackingSlots && !this.needsWeakening && !this.needsGrowing
        }
    }

    addAttacker(attacker: Attacker, action: Action) {
        this.attackers.get(action)?.set(attacker.name, (this.attackers.get(action)?.get(attacker.name) ?? 0) + attacker.threads)
    }

    removeAttacker(action: Action, attacker: string, threads: number) {
        const newThreads = (this.attackers.get(action)?.get(attacker) ?? 0) - threads;
        if (newThreads <= 0) {
            this.attackers.get(action)?.delete(attacker);
        } else {
            this.attackers.get(action)?.set(attacker, newThreads);
        }
    }
}