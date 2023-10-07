import {NS} from "@ns";
import {getAvailablePortCrackers} from "/util/ports";
import {Script} from "/cc/Script";
import {Target} from "/cc/Target";
import {Commander} from "/cc/Commander";

export class Controller {
    private static filesToDeploy = ['cc/Receiver.js', 'cc/config.js', 'cc/PortListener.js', 'single_hack.js', 'single_weaken.js', 'single_grow.js'];
    private static receiverScript = new Script("");
    private static hackerScript = new Script('single_hack.js', ['target'])
    private static weakenScript = new Script('single_weaken.js', ['target'])
    private static growScript = new Script('single_grow.js', ['target'])

    constructor(private readonly ns: NS, private readonly commander: Commander) {
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

    startReceiver(servers: string[], restart: boolean) {
        const results = [];
        for (const server of servers) {
            if (restart) {
                this.killReceiver(server);
            }
            if (this.isReceiverRunning(server)) {
                continue;
            }

            results.push(Controller.receiverScript.start(this.ns, server));
        }
        return results;
    }

    hackServers(servers: string[]) {
        for (const server of servers) {
            this.hackServer(server);
        }
        return servers
    }

    attackTargets(attackers: string[], targets: Target[]) {
        const results = [];
        let hackTarget = this.findNextTargetToHack(targets);

        while (hackTarget !== null) {
            const hackResult = this.hackTarget(attackers, hackTarget);
            results.push(
                {
                    attackers: hackResult.attackers,
                    target: hackTarget,
                    expectedTime: hackTarget.timeToHack,
                    action: 'hack'
                });
            if (!hackResult.fulfilled) {
                break;
            }
            hackTarget = this.findNextTargetToHack(targets);
        }
        let growTarget = this.findNextTargetToGrow(targets);
        while (growTarget !== null) {
            const growResult = this.growTarget(attackers, growTarget);
            results.push(
                {
                    attackers: growResult.attackers,
                    target: growTarget,
                    expectedTime: growTarget.timeToGrow,
                    action: 'grow'
                });
            if (!growResult.fulfilled) {
                break;
            }
            growTarget = this.findNextTargetToGrow(targets);
        }
        let weakenTarget = this.findNextTargetToWeaken(targets);
        while (weakenTarget !== null) {
            const weakenResult = this.weakenTarget(attackers, weakenTarget);
            results.push(
                {
                    attackers: weakenResult.attackers,
                    target: weakenTarget,
                    expectedTime: weakenTarget.timeToWeaken,
                    action: 'weaken'
                });
            if (!weakenResult.fulfilled) {
                break;
            }
            weakenTarget = this.findNextTargetToWeaken(targets);
        }
        return results;
    }

    hackTarget(attackers: string[], target: Target) {
        const result = this.executeScript(attackers, target, Controller.hackerScript, target.threadsToHack)
        if (result.attackers) {
            for (const attacker of result.attackers) {
                target.addHacker(attacker);
            }
        }
        return result
    }

    weakenTarget(attackers: string[], target: Target) {
        const result = this.executeScript(attackers, target, Controller.weakenScript, target.threadsToWeaken)
        if (result.attackers) {
            for (const attacker of result.attackers) {
                target.addWeakener(attacker);
            }
        }
        return result
    }

    growTarget(attackers: string[], target: Target) {
        const result = this.executeScript(attackers, target, Controller.growScript, target.threadsToGrow)
        if (result.attackers) {
            for (const attacker of result.attackers) {
                target.addGrower(attacker);
            }
        }
        return result
    }

    findBestAttacker(attackers: string[], neededThreads: number, script: Script) {
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

    findNextTargetToWeaken(targets: Target[]) {
        let bestTarget = null;
        for (const target of targets) {
            // Only weaken if time to weaken is less than 10 min
            if (target.timeToWeaken > 600 || !target.needsWeakening) {
                continue;
            }
            if (bestTarget === null) {
                bestTarget = target;
                continue;
            }
            if (target.timeToWeaken < bestTarget.timeToWeaken) {
                bestTarget = target
            }
        }
        return bestTarget;
    }

    findNextTargetToGrow(targets: Target[]) {
        let bestTarget = null;
        for (const target of targets) {
            // Only weaken if time to grow is less than 10 min
            // this.ns.tprintf('grow target %s, ttG %d, needsGrow %s, needsWeaken %s', target.name, target.timeToGrow, target.needsGrowing ? 'y' : 'n', target.needsWeakening ? 'y' : 'n');
            if (target.timeToGrow > 600 || !target.needsGrowing || target.needsWeakening) {
                continue;
            }
            if (bestTarget === null) {
                bestTarget = target;
                continue;
            }
            if (target.timeToGrow < bestTarget.timeToGrow) {
                bestTarget = target
            }
        }
        return bestTarget;
    }

    findNextTargetToHack(targets: Target[]) {
        let bestTarget = null;
        for (const target of targets) {
            // Only weaken if time to grow is less than 10 min
            if (target.timeToHack > 600 || target.needsGrowing || target.needsWeakening || !target.hasFreeHackingSlots) {
                continue;
            }
            if (bestTarget === null) {
                bestTarget = target;
                continue;
            }
            if (target.timeToHack < bestTarget.timeToHack) {
                bestTarget = target
            }
        }
        return bestTarget;
    }

    private executeScript(attackers: string[], target: Target, script: Script, requiredThreads: number) {
        const chosenAttackers: {
            name: string,
            threads: number
        }[] = []
        while (requiredThreads > 0) {
            const attacker = this.findBestAttacker(attackers, requiredThreads, script)
            if (attacker === null) {
                return {
                    fulfilled: false,
                    attackers: chosenAttackers,
                }
            }
            const result = script.run(this.ns, attacker, target, requiredThreads);
            if (result.started) {
                chosenAttackers.push({
                    name: result.server,
                    threads: result.threads
                });
                requiredThreads -= result.threads;
            }
        }
        return {
            fulfilled: true,
            attackers: chosenAttackers,
        }
    }

    private killReceiver(server: string) {
        return this.getRunningReceivers(server)
            .map(p => this.ns.kill(p.pid))
            .reduce((k, p) => k && p, true);
    }

    private isReceiverRunning(server: string) {
        return this.getRunningReceivers(server).length > 0
    }

    private getRunningReceivers(server: string) {
        return this.ns.ps(server)
            .filter(p => p.filename === Controller.receiverScript.name);
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