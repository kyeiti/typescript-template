import {NS} from "@ns";
import {Commander} from "/cc/Commander";
import {Scanner} from "/cc/Scanner";
import {Controller} from "/cc/Controller";
import {Target} from "/cc/Target";

export async function main(ns: NS) {
    const scanner = new Scanner(ns);
    const commander = new Commander(ns)
    const controller = new Controller(ns, commander);

    ns.tprintf('Hacking servers...');

    const hackResult = controller.hackServers(scanner.hackable)
    for (const server of hackResult) {
        ns.tprintf('> Hacked %s', server);
    }

    ns.tprintf(' ');

    ns.tprintf('Deploying...');
    const deployResult = controller.deploy(scanner.accessible)
    for (const result of deployResult) {
        if(!result.success)
        ns.tprintf('> Failed to deployed %s to %s', result.files.join(", "), result.server);
    }

    ns.tprintf(' ');

    // ns.tprintf('Starting Scripts...');
    // const startResult = controller.startReceiver(scanner.accessible, restart)
    // for (const result of startResult) {
    //     if (result.started) {
    //         ns.tprintf('> Starting %s on %s with %d threads using %f GiB', result.script.name, result.server, result.threads, result.usedRAM);
    //     } else {
    //         ns.tprintf('Not enough RAM to start %s on %s (%fGiB/%fGiB)', result.script.name, result.server, result.remainingRAM, result.scriptRAM);
    //     }
    // }

    const targets = scanner.targets.map(s => new Target(ns, s));
    const attackers = scanner.attackers;
    ns.tprintf('Starting Attack...');
    await attack(ns, targets, attackers, controller, commander);

}

async function attack(ns: NS, targets: Target[], attackers: string[], controller: Controller, commander: Commander) {
    const results = controller.attackTargets(attackers, targets);
    for (const result of results) {
        for (const attacker of result.attackers) {
            ns.tprintf('> Attacking %s with %s from %s with %d threads', result.target.name, result.action, attacker.name, attacker.threads);
        }
    }
    if(results.length > 0) {
        ns.tprintf('---')
    }
    await commander.listen().then((data) => {
        const target = targets.find(t => t.name === data.target)
        if(!target) {
            return;
        }
        if(data.action === 'hack') {
            target.removeHacker(data.host)
        } else if(data.action === 'weaken') {
            target.removeWeakener(data.host)
        } else if(data.action === 'grow') {
            target.removeGrower(data.host)
        }
    })
    await attack(ns, targets, attackers, controller, commander)
}