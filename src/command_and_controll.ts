import {NS} from "@ns";
import {Commander} from "/cc/Commander";
import {Scanner} from "/cc/Scanner";
import {Controller} from "/cc/Controller";
import {Target} from "/cc/Target";

export async function main(ns: NS) {
    const scanner = new Scanner(ns);
    const commander = new Commander(ns)
    const controller = new Controller(ns);

    // ns.atExit(controller.generateStatistics)
    ns.disableLog('ALL')

    hackServers(ns, controller, scanner);

    ns.printf('Deploying...');
    const deployResult = controller.deploy(scanner.accessible)
    for (const result of deployResult) {
        if(!result.success)
        ns.printf('> Failed to deployed %s to %s', result.files.join(", "), result.server);
    }

    ns.printf(' ');

    const targets = scanner.targets.map(s => new Target(ns, s));
    const attackers = scanner.attackers;
    ns.printf('Starting Attack...');
    await attack(ns, targets, attackers, controller, commander);
}

async function attack(ns: NS, targets: Target[], attackers: string[], controller: Controller, commander: Commander) {
    const results = controller.attackTargets(attackers, targets);
    for (const result of results) {
        if(result.action !== "grow") {
            for (const attacker of result.attackers) {
                ns.printf('> %6s  security: %7.3f/%2d; eta: %3ds; threads: %3d; %s ← %s',
                    result.action, result.target.securityLevel, result.target.minSecurityLevel, result.expectedTime, attacker.threads, result.target.name, attacker.name);
            }
        }
    }
    if(results.filter(r => r.action !== "grow").length > 0) {
        ns.printf('---')
    }
    await commander.listen().then((data) => {
        const target = targets.find(t => t.name === data.target)
        if(!target) {
            return;
        }
        target.removeAttacker(data.action, data.host, data.threads)
    })
    await attack(ns, targets, attackers, controller, commander)
}

function hackServers(ns: NS, controller: Controller, scanner: Scanner) {
    ns.printf('Hacking servers...');
    const hackResult = controller.hackServers(scanner.hackable)
    for (const server of hackResult) {
        ns.printf('> Hacked %s', server);
    }
    ns.printf(' ');
    // ns.sleep(60000).then(
    //     () => hackServers(ns, controller, scanner)
    // )
}