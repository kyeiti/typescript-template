import {NS} from "@ns";
import {
    allowedRaisedSecurity,
    attackTimeAllowedOnRaisedSecurity,
    growthLimit,
    pctToHack,
    targetsToSkipForGrow,
    targetsToSkipForHack
} from "/cc/config";
import {Attack, AttackResult, attacks} from "/cc/types";
import {IAttacker, ITargetWithStatistics} from "/cc/IServer";

export class Target implements ITargetWithStatistics{
    public static readonly weakenPerThread = 0.05;
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

    get isGettingWeakenedBy() {
        return [...this.attackers.get('weaken')!.values()].reduce((p, c) => p + c, 0)
    }

    get isGettingGrownBy() {
        return [...this.attackers.get('grow')!.values()].reduce((p, c) => p + c, 0)
    }

    get isGettingHackedBy() {
        return [...this.attackers.get('hack')!.values()].reduce((p, c) => p + c, 0)
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
        return this.getThreadsToWeaken(this.securityLevel - this.minSecurityLevel)
            - this.isGettingWeakenedBy
            + this.getThreadsToWeaken(this.secIncreaseForHack(this.isGettingHackedBy))
            + this.getThreadsToWeaken(this.secIncreaseForGrowth(this.isGettingGrownBy))
            ;
    }

    get threadsToGrow(): number {
        const moneyToGeneratePct = this.maxMoney / this.availableMoney * (this.isGettingHackedBy > 0 ? 1 + pctToHack : 1);
        if (this.availableMoney === 0) {
            return 1;
        }
        if (moneyToGeneratePct < 1) {
            return 0;
        }
        return Math.ceil(this.ns.growthAnalyze(this.name, moneyToGeneratePct)) - this.isGettingGrownBy;
    }

    get threadsToHack(): number {
        return Math.floor(this.ns.hackAnalyzeThreads(this.name, this.availableMoney * pctToHack)) - this.isGettingHackedBy;
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
                return !this.reachedGrowthLimit && !this.hasRaisedSecurity && this.canGrow && !targetsToSkipForGrow.includes(this.name);
            case "hack":
                return this.hasFreeHackingSlots && !this.hasRaisedSecurity && this.hasEnoughMoneyToHack && this.threadsToHack > 0 && !targetsToSkipForHack.includes(this.name)
        }
    }

    addAttacker(action: string, attacker: IAttacker, threads: number) {
        const action_ = this.findAttack(action);
        this.attackers.get(action_)?.set(attacker.name, (this.attackers.get(action_)?.get(attacker.name) ?? 0) + threads)
    }

    attackFinished(result: AttackResult){
        this.removeAttacker(result.action, result.host, result.threads)
    }

    private get hasRaisedSecurity() {
        return this.securityLevel - this.minSecurityLevel > allowedRaisedSecurity && this.timeToGrow > attackTimeAllowedOnRaisedSecurity
    }

    private get canGrow(): boolean {
        return this.threadsToGrow > 0;
    }

    private get canWeaken(): boolean {
        return this.threadsToWeaken > 0;
    }

    private get reachedGrowthLimit() {
        return this.availableMoney / this.maxMoney > growthLimit
    }

    private get hasEnoughMoneyToHack() {
        return this.availableMoney / this.maxMoney > pctToHack + 0.05
    }

    private get hasFreeHackingSlots() {
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

    private removeAttacker(action: Attack, attacker: string, threads: number) {
        const newThreads = (this.attackers.get(action)?.get(attacker) ?? 0) - threads;
        if (newThreads <= 0) {
            this.attackers.get(action)?.delete(attacker);
        } else {
            this.attackers.get(action)?.set(attacker, newThreads);
        }
    }

    private findAttack(type: string): Attack {
        switch (type) {
            case "controlled/single_weaken.js": // TODO: Move script-names into constants somewhere
            case "weaken":
                return "weaken";
            case "controlled/single_grow.js":
            case "grow":
                return "grow";
            case "controlled/single_hack.js":
            case "hack":
                return "hack";
            default:
                throw new Error("unknown attack-type");
        }
    }
}