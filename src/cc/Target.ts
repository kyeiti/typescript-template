import {NS} from "@ns";
import {Action} from "/cc/config";

type Attacker = {
    name: string,
    threads: number,
}

export class Target {
    public static readonly weakenPerThread = 0.05;
    public static readonly allowedRaisedSecurity = 1;
    public static readonly growthLimit = 0.9;
    public static readonly pctToHack = 0.11;
    public static readonly attackTimeAllowedOnRaisedSecurity = 10 // seconds
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

    get actionsToExecute(): Action[] {
        return (["grow", "weaken", "hack"] as Action[]).filter(a => this.shouldExecuteAction(a))
    }

    get runningActions(): Action[] {
        return (["grow", "weaken", "hack"] as Action[]).filter(a => (this.attackers.get(a)?.size ?? 0) > 0)
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

    get canWeaken(): boolean {
        return this.threadsToWeaken > 0;
    }

    get isGettingWeakendBy() {
        return [...this.attackers.get('weaken')!.values()].reduce((p, c) => p+c, 0)
    }

    get isGettingGrownBy() {
        return [...this.attackers.get('grow')!.values()].reduce((p, c) => p+c, 0)
    }

    get isGettingHackedBy() {
        return [...this.attackers.get('hack')!.values()].reduce((p, c) => p+c, 0)
    }

    get reachedGrowthLimit() {
        return this.availableMoney / this.maxMoney > Target.growthLimit
    }

    get canGrow(): boolean {
        return this.threadsToGrow > 0;
    }

    get maxMoney(): number {
        return this.ns.getServerMaxMoney(this.name)
    }

    get availableMoney(): number {
        return this.ns.getServerMoneyAvailable(this.name)
    }

    get hasRaisedSecurity() {
        return this.securityLevel - this.minSecurityLevel > Target.allowedRaisedSecurity && this.timeToGrow > Target.attackTimeAllowedOnRaisedSecurity
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
        const threads = (this.securityLevel - this.minSecurityLevel) / Target.weakenPerThread
        return Math.ceil(threads) - this.isGettingWeakendBy;
    }

    get threadsToGrow(): number {
        const moneyToGeneratePct = (1 - this.availableMoney / this.maxMoney) * 100;
        if(this.availableMoney === 0) {
            return 1;
        }
        if (moneyToGeneratePct < 1) {
            return 0;
        }
        return Math.ceil(this.ns.growthAnalyze(this.name, moneyToGeneratePct)) - this.isGettingGrownBy;
    }

    get threadsToHack(): number {
        return Math.floor(this.ns.hackAnalyzeThreads(this.name, this.availableMoney * Target.pctToHack)) - this.isGettingHackedBy;
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

    shouldExecuteAction(action: Action) {
        switch (action) {
            case "weaken":
                return this.securityLevel - this.minSecurityLevel > Target.weakenPerThread && this.canWeaken;
            case "grow":
                return !this.reachedGrowthLimit && !this.hasRaisedSecurity && this.canGrow;
            case "hack":
                return this.hasFreeHackingSlots && !this.hasRaisedSecurity && this.reachedGrowthLimit && this.threadsToHack > 0
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