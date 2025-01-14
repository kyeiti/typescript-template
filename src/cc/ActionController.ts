import {growTimeLimit, hackTimeLimit, weakenTimeLimit} from "/cc/config";
import {Action, Attack} from "/cc/types";
import {IAttacker, ITarget} from "/cc/IServer";

export class ActionController {

    attackTargets(attackers: readonly IAttacker[], targets: readonly ITarget[]) {
        const results = [];

        for (const action of ["hack", "grow", "weaken",] as readonly Attack[]) {
            let target = this.findNextTarget(action, targets);
            while (target !== null) {
                const hackResult = this.attackTarget(action, attackers, target);
                if (hackResult.attackers.length > 0) {
                    results.push(
                        {
                            attackers: hackResult.attackers,
                            target: target,
                            expectedTime: target.timeNeeded(action),
                            action: action
                        });
                }
                if (!hackResult.fulfilled) {
                    break;
                }
                target = this.findNextTarget(action, targets);
            }
        }
        return results;
    }

    supportFaction(attackers: readonly IAttacker[]) {
        for (const attacker of attackers) {
            attacker.shareThreadsWithFaction();
        }
    }

    private attackTarget(action: Attack, attackers: readonly IAttacker[], target: ITarget, threads?: number) {
        return this.executeAttack(attackers, target, action, threads ?? target.threadsNeeded(action))
    }

    private findBestAttacker(attackers: readonly IAttacker[], neededThreads: number, action: Action) {
        let bestAttacker = null;
        let bestThreads = 0;
        for (const attacker of attackers) {
            const availableThreads = attacker.getAvailableThreadsForAction(action);
            if (
                (bestAttacker === null && availableThreads > 0) ||
                (bestThreads > neededThreads && availableThreads > neededThreads && bestThreads > neededThreads) ||
                (availableThreads > bestThreads)
            ) {
                bestAttacker = attacker;
                bestThreads = availableThreads;
            }
            if (bestThreads === neededThreads) {
                break
            }
        }
        if (bestAttacker === null) {
            return null;
        }
        return bestAttacker;
    }

    private findNextTarget(action: Attack, targets: readonly ITarget[]) {
        let bestTarget = null;
        for (const target of targets) {
            // Only attack if time to action is less than 10 min
            if (target.timeNeeded(action) > this.timeLimit(action) || !target.shouldReceiveAttack(action)) {
                continue;
            }
            if (bestTarget === null) {
                bestTarget = target;
                continue;
            }
            if (target.timeNeeded(action) < bestTarget.timeNeeded(action)) {
                bestTarget = target
            }
        }
        return bestTarget;
    }

    private timeLimit(action: Attack) {
        switch (action) {
            case "grow":
                return growTimeLimit
            case "hack":
                return hackTimeLimit
            case "weaken":
                return weakenTimeLimit;
        }
    }

    private executeAttack(attackers: readonly IAttacker[], target: ITarget, action: Attack, requiredThreads: number) {
        const chosenAttackers: {
            name: string,
            threads: number
        }[] = []
        let createdThreads = 0;
        while (createdThreads < requiredThreads) {
            const attacker = this.findBestAttacker(attackers, requiredThreads, action)
            if (attacker === null) {
                break;
            }
            const result = attacker.attack(action, target, requiredThreads);
            if (result.started) {
                chosenAttackers.push({
                    name: result.attacker,
                    threads: result.threads
                });
                createdThreads += result.threads;
            }
        }
        return {
            fulfilled: createdThreads >= requiredThreads,
            attackers: chosenAttackers,
            createdThreads: createdThreads,
        }
    }
}