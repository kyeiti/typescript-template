import {NS} from "@ns";
import {Action, attacks, Attack, CommandResult, AttackResult} from "/cc/config";

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
    public attackers: Map<Attack, Map<string, number>> = new Map([
        ['hack', new Map()],
        ['weaken', new Map()],
        ['grow', new Map()]
    ]);

    constructor(
        private readonly ns: NS,
        public readonly name: string) {
    }

    get actionsToExecute(): Attack[] {
        return attacks.filter(a => this.shouldReceiveAttack(a))
    }

    get runningActions(): Attack[] {
        return attacks.filter(a => (this.attackers.get(a)?.size ?? 0) > 0)
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

    get isGettingWeakenedBy() {
        return [...this.attackers.get('weaken')!.values()].reduce((p, c) => p + c, 0)
    }

    get isGettingGrownBy() {
        return [...this.attackers.get('grow')!.values()].reduce((p, c) => p + c, 0)
    }

    get isGettingHackedBy() {
        return [...this.attackers.get('hack')!.values()].reduce((p, c) => p + c, 0)
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
        return this.getThreadsToWeaken(this.securityLevel - this.minSecurityLevel)
            - this.isGettingWeakenedBy
            + this.getThreadsToWeaken(this.secIncreaseForHack(this.isGettingHackedBy))
            + this.getThreadsToWeaken(this.secIncreaseForGrowth(this.isGettingGrownBy))
            ;
    }

    get threadsToGrow(): number {
        const moneyToGeneratePct = this.maxMoney / this.availableMoney;
        if (this.availableMoney === 0) {
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

    private getThreadsToWeaken(securityDecrease: number) {
        const threads = securityDecrease / Target.weakenPerThread
        return Math.ceil(threads);
    }

    private secIncreaseForHack(threads: number): number {
        return this.ns.hackAnalyzeSecurity(threads, this.name)
    }

    private secIncreaseForGrowth(threads: number): number {
        return this.ns.growthAnalyzeSecurity(threads, this.name);
    }

    threadsNeeded(action: Attack) {
        switch (action) {
            case "hack":
                return this.threadsToHack;
            case "weaken":
                return this.threadsToWeaken;
            case "grow":
                return this.threadsToGrow;
        }
    }

    timeNeeded(action: Attack) {
        switch (action) {
            case "hack":
                return this.timeToHack;
            case "weaken":
                return this.timeToWeaken;
            case "grow":
                return this.timeToGrow;
        }
    }

    shouldReceiveAttack(action: Attack) {
        switch (action) {
            case "weaken":
                return this.canWeaken;
            case "grow":
                return !this.reachedGrowthLimit && !this.hasRaisedSecurity && this.canGrow;
            case "hack":
                return this.hasFreeHackingSlots && !this.hasRaisedSecurity && this.reachedGrowthLimit && this.threadsToHack > 0
        }
    }

    addAttacker(attacker: Attacker, action: string) {
        const action_ = this.findAttack(action);
        this.attackers.get(action_)?.set(attacker.name, (this.attackers.get(action_)?.get(attacker.name) ?? 0) + attacker.threads)
    }

    removeAttacker(action: Attack, attacker: string, threads: number) {
        const newThreads = (this.attackers.get(action)?.get(attacker) ?? 0) - threads;
        if (newThreads <= 0) {
            this.attackers.get(action)?.delete(attacker);
        } else {
            this.attackers.get(action)?.set(attacker, newThreads);
        }
    }

    attackFinished(result: AttackResult){
        this.removeAttacker(result.action, result.host, result.threads)
    }

    private findAttack(type: string): Attack {
        switch (type) {
            case "single_weaken.js": // TODO: Move script-names into constants somewhere
            case "weaken":
                return "weaken";
            case "single_grow.js":
            case "grow":
                return "grow";
            case "single_hack.js":
            case "hack":
                return "hack";
            default:
                throw new Error("unknown attack-type");
        }
    }
}