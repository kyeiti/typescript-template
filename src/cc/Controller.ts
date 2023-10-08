import {NS} from "@ns";
import {getAvailablePortCrackers} from "/util/ports";
import {Script} from "/cc/Script";
import {Target} from "/cc/Target";
import {Action, growTimeLimit, hackTimeLimit, weakenTimeLimit} from "/cc/config";

export class Controller {
    private static filesToDeploy = ['cc/Receiver.js', 'cc/config.js', 'cc/PortListener.js', 'single_hack.js', 'single_weaken.js', 'single_grow.js'];
    private static hackerScript = new Script('single_hack.js', ['target', 'host', 'threads'])
    private static weakenScript = new Script('single_weaken.js', ['target', 'host', 'threads'])
    private static growScript = new Script('single_grow.js', ['target', 'host', 'threads'])

    constructor(private readonly ns: NS) {
    }

    deploy(servers: string[]) {
        const deployed = []
        for (const server of servers) {
            deployed.push({
                server: server,
                files: Controller.filesToDeploy,
                success: this.ns.scp(Controller.filesToDeploy, server),
            })
        }
        return deployed;
    }

    hackServers(servers: string[]) {
        for (const server of servers) {
            this.hackServer(server);
        }
        return servers
    }

    attackTargets(attackers: string[], targets: Target[]) {
        const results = [];

        for(const action of ["hack", "weaken", "grow", ] as Action[]) {
            let target = this.findNextTarget(action, targets);
            while (target !== null) {
                const hackResult = this.attackTarget(action, attackers, target);
                if (hackResult.attackers.length > 0) {
                    results.push(
                        {
                            attackers: hackResult.attackers,
                            target: target,
                            expectedTime: target.timeToHack,
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

    private attackScript(action: Action) {
        switch (action) {
            case "weaken":
                return Controller.weakenScript;
            case "hack":
                return Controller.hackerScript;
            case "grow":
                return Controller.growScript;
        }
    }

    private attackTarget(action: Action, attackers: string[], target: Target, threads?: number) {
        const result = this.executeScript(attackers, target, this.attackScript(action), threads ?? target.threadsNeeded(action))
        if (result.attackers) {
            for (const attacker of result.attackers) {
                target.addAttacker(attacker, action);
            }
        }
        if(result.createdThreads > 0) {
            if (action === "hack") {
                this.attackTarget('weaken', attackers, target, target.getThreadsToWeaken(target.secIncreaseForHack(result.createdThreads)));
            }
            if (action === "grow") {
                this.attackTarget('weaken', attackers, target, target.getThreadsToWeaken(target.secIncreaseForGrowth(result.createdThreads)));
            }
        }
        return result
    }

    private findBestAttacker(attackers: string[], neededThreads: number, script: Script) {
        let bestAttacker = null;
        let bestThreads = 0;
        for (const attacker of attackers) {
            const availableRam = this.ns.getServerMaxRam(attacker) - this.ns.getServerUsedRam(attacker);
            const availableThreads = Math.floor(availableRam / this.ns.getScriptRam(script.name, attacker));
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
        return {name: bestAttacker, threads: bestThreads};
    }

    private findNextTarget(action: Action, targets: Target[]) {
        let bestTarget = null;
        for (const target of targets) {
            // Only attack if time to action is less than 10 min
            if (target.timeNeeded(action) > this.timeLimit(action) || !target.shouldExecuteAction(action)) {
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

    private timeLimit(action: Action) {
        switch (action) {
            case "grow":
                return growTimeLimit
            case "hack":
                return hackTimeLimit
            case "weaken":
                return weakenTimeLimit;
        }
    }

    private executeScript(attackers: string[], target: Target, script: Script, requiredThreads: number) {
        const chosenAttackers: {
            name: string,
            threads: number
        }[] = []
        let createdThreads = 0;
        while (createdThreads < requiredThreads) {
            const attacker = this.findBestAttacker(attackers, requiredThreads, script)
            if (attacker === null) {
                break;
            }
            const result = script.run(this.ns, attacker, target, requiredThreads);
            if (result.started) {
                chosenAttackers.push({
                    name: result.server,
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

    private hackServer(server: string) {
        const crackers = getAvailablePortCrackers(this.ns);
        for (const cracker of crackers) {
            cracker.crack(this.ns, server);
        }
        this.ns.nuke(server);
        if (this.ns.getScriptRam('backdoor.js') <= this.ns.getServerMaxRam(server)) {
            this.ns.scp('backdoor.js', server);
//    this.ns.exec('backdoor.js', server);
        }
    }
}