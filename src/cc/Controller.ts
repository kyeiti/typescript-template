import {NS} from "@ns";
import {getAvailablePortCrackers} from "/util/ports";
import {Script} from "/cc/Script";
import {Target} from "/cc/Target";
import {Attack, growTimeLimit, hackTimeLimit, weakenTimeLimit} from "/cc/config";
import {Attacker} from "/cc/Attacker";

export class Controller {
    private static filesToDeploy = ['cc/Receiver.js', 'cc/config.js', 'cc/PortListener.js', 'single_hack.js', 'single_weaken.js', 'single_grow.js', 'support_faction.js'];
    private static hackerScript = new Script('single_hack.js', ['target', 'host', 'threads'])
    private static weakenScript = new Script('single_weaken.js', ['target', 'host', 'threads'])
    private static growScript = new Script('single_grow.js', ['target', 'host', 'threads'])
    private static supportScript = new Script('support_faction.js', [])

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

    attackTargets(attackers: Attacker[], targets: Target[]) {
        const results = [];

        for(const action of ["hack", "weaken", "grow", ] as Attack[]) {
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

    supportFaction(attackers: Attacker[]) {
        for(const attacker of attackers) {
            if(attacker.getAvailableThreadsFor(Controller.supportScript) > 1) {
                Controller.supportScript.run(this.ns, attacker, new Target(this.ns, ""), attacker.getAvailableThreadsFor(Controller.supportScript))
            }
        }
        this.executeScript(attackers, new Target(this.ns, ""), Controller.supportScript, 1_000_000);
    }

    private attackScript(action: Attack) {
        switch (action) {
            case "weaken":
                return Controller.weakenScript;
            case "hack":
                return Controller.hackerScript;
            case "grow":
                return Controller.growScript;
        }
    }

    private attackTarget(action: Attack, attackers: Attacker[], target: Target, threads?: number) {
        const result = this.executeScript(attackers, target, this.attackScript(action), threads ?? target.threadsNeeded(action))
        if (result.attackers) {
            for (const attacker of result.attackers) {
                target.addAttacker(attacker, action);
            }
        }
        return result
    }

    private findBestAttacker(attackers: Attacker[], neededThreads: number, script: Script) {
        let bestAttacker = null;
        let bestThreads = 0;
        for (const attacker of attackers) {
            const availableThreads = attacker.getAvailableThreadsFor(script);
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

    private findNextTarget(action: Attack, targets: Target[]) {
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

    private executeScript(attackers: Attacker[], target: Target, script: Script, requiredThreads: number) {
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