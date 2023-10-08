import {NS} from "@ns";
import {Commander} from "/cc/Commander";
import {Scanner} from "/cc/Scanner";
import {Controller} from "/cc/Controller";
import {Target} from "/cc/Target";
import {bFormat, printTable, TableColumn} from "/util/table";
import {actions, attackersToSkip} from "/cc/config";


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
        if (!result.success)
            ns.printf('> Failed to deployed %s to %s', result.files.join(", "), result.server);
    }

    ns.printf(' ');

    const targets = scanner.targets.map(s => new Target(ns, s));
    const attackers = scanner.attackers.filter(v => !attackersToSkip.includes(v));
    ns.printf('Starting Attack...');
    await attack(ns, targets, attackers, controller, commander);
}

async function attack(ns: NS, targets: Target[], attackers: string[], controller: Controller, commander: Commander) {
    const results = controller.attackTargets(attackers, targets);
    for (const result of results) {
        if (result.action !== "grow") {
            for (const attacker of result.attackers) {
                ns.printf('> %6s | security: %7.3f/%2d | eta: %3ds | threads: %3d | %s ← %s',
                    result.action, result.target.securityLevel, result.target.minSecurityLevel, result.expectedTime, attacker.threads, result.target.name, attacker.name);
            }
        }
    }
    if (results
        .filter(r => r.action !== "grow")
        .length > 0) {
        ns.printf('---')
        ns.printf("Current status:")
        printStatusTable(ns, targets)
        ns.printf('---')
    }
    await commander.listen().then((data) => {
        const target = targets.find(t => t.name === data.target)
        if (!target) {
            return;
        }
        target.removeAttacker(data.action, data.host, data.threads)
    })
    await attack(ns, targets, attackers, controller, commander)
}

function printStatusTable(ns: NS, targets: Target[]) {
    const cols: TableColumn[][] = [
        [
            {hTpl: '%19s', dTpl: '%19s', h: 'Host', k: {}, d: targets.map(o => o.name)},
            {hTpl: '%4s', dTpl: '%4s', h: 'Todo', k: {}, d: targets.map(o => actions.map(a => o.actionsToExecute.includes(a) ? a.charAt(0) : " ").join(""))},
            {hTpl: '%4s', dTpl: '%4s', h: 'Work', k: {}, d: targets.map(o => actions.map(a => o.runningActions.includes(a) ? a.charAt(0) : " ").join(""))},
        ],
        [
            {hTpl: '%1s', dTpl: '%1s', h: '↘', k: {}, d: targets.map(o => bFormat(o.shouldExecuteAction("weaken")))},
            {hTpl: '%11s', dTpl: '%4d / %4d', h: 'threads', k: {}, d: targets.map(o => [o.isGettingWeakenedBy, o.threadsToWeaken])},
            {hTpl: '%10s', dTpl: '%5.2f / %2d', h: 'security', k: {}, d: targets.map(o => [o.securityLevel, o.minSecurityLevel])},
            {hTpl: '%7s', dTpl: '%7.2f', h: 'time(s)', k: {}, d: targets.map(o => [o.timeToWeaken])},
        ], [
            {hTpl: '%1s', dTpl: '%1s', h: '↗', k: {}, d: targets.map(o => bFormat(o.shouldExecuteAction("grow")))},
            {hTpl: '%13s', dTpl: '%5d / %5d', h: 'threads', k: {}, d: targets.map(o => [o.isGettingGrownBy, o.threadsToGrow])},
            {hTpl: '%6s', dTpl: '%5d%%', h: 'factor', k: {}, d: targets.map(o => [o.growthPct])},
            {hTpl: '%7s', dTpl: '%7.2f', h: 'time(s)', k: {}, d: targets.map(o => [o.timeToGrow])},
        ], [
            {hTpl: '%1s', dTpl: '%1s', h: '$', k: {}, d: targets.map(o => bFormat(o.shouldExecuteAction("hack")))},
            {hTpl: '%11s', dTpl: '%4d / %4d', h: 'threads', k: {}, d: targets.map(o => [o.isGettingHackedBy, o.threadsToHack])},
            {hTpl: '%7s', dTpl: '%7.2f', h: 'time(s)', k: {}, d: targets.map(o => [o.timeToHack])},
            {hTpl: '%19s', dTpl: '%8.2f / %8.2f', h: 'money(m)', k: {}, d: targets.map(o => [o.availableMoney / 1000_000, o.maxMoney / 1000_000])},
            {hTpl: '%5s', dTpl: '%5.1f', h: '$(%)', k: {}, d: targets.map(o => o.availableMoney / o.maxMoney * 100)},
        ],
    ];
    printTable(ns.printf, cols)
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