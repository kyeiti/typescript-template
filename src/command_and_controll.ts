import {NS} from "@ns";
import {Scanner} from "/cc/Scanner";
import {ActionController} from "/cc/ActionController";
import {Target} from "/cc/Target";
import {printTable, TableColumn} from "/TUI/table";
import {formatTime} from "/util/formatters";
import {attackersToSkip, supportFactions, waitTime} from "/cc/config";
import {Attacker} from "/cc/Attacker";
import {attacks} from "/cc/types";
import {IAttacker} from "/cc/IServer";
import {Hacker} from "/cc/Hacker";
import {Deployer} from "/cc/Deployer";


export async function main(ns: NS) {
    const printer = ns.printf;
    const scanner = new Scanner(ns);
    const controller = new ActionController();
    const hacker = new Hacker(ns, scanner);
    const deployer = new Deployer(ns);

    // ns.atExit(controller.generateStatistics)
    ns.disableLog('ALL')

    hackServers(printer, hacker);

    printer('Deploying...');
    const deployResult = deployer.deployTo(scanner.accessible)
    for (const result of deployResult) {
        if (!result.success)
            printer('> Failed to deployed %s to %s', result.files.join(", "), result.server);
    }

    printer(' ');
    printer('Starting Attack...');
    // await attack(ns, printer, targets, attackers, controller, commander);
    await attackRead(ns, printer, scanner, controller);
}

function getTargets(ns: NS, attackers: readonly IAttacker[], scanner: Scanner) {
    const targets = scanner.targets.map(s => new Target(ns, s));
    for (const attacker of attackers) {
        for (const process of ns.ps(attacker.name)) {
            if (!["controlled/single_weaken.js", "controlled/single_hack.js", "controlled/single_grow.js"].includes(process.filename)) {
                continue;
            }
            const flags: { [key: string]: string | number | boolean } = {};
            for (let i = 0; i < process.args.length; i = i + 2) {
                flags[<string>process.args[i]] = process.args[i + 1]
            }
            const targetName = <string>flags["--target"];
            const target = targets.find(t => t.name === targetName);
            if (!target) {
                throw new Error("unknown target: " + flags["--target"]);
            }
            target.addAttacker(process.filename, attacker, process.threads);
        }
    }
    return targets;
}

async function attackRead(ns: NS, printer: (fmt: string, ...args: any[]) => void, scanner: Scanner, controller: ActionController) {
    const attackers = scanner.attackers.filter(v => !attackersToSkip.includes(v)).map(s => new Attacker(ns, s));
    const targets = getTargets(ns, attackers, scanner)
    controller.attackTargets(attackers, targets);
    if (supportFactions) {
        controller.supportFaction(attackers);
    }
    let processCount = 0;
    for (const attacker of attackers) {
        processCount += ns.ps(attacker.name).length;
    }
    printer("%s; Processes: %d", new Date().toISOString(), processCount)
    printer('---')
    printer("Current status:")
    printer("Share power: %f", ns.getSharePower())
    printStatusTable(printer, targets)
    printer('---')

    await ns.sleep(waitTime)
    await attackRead(ns, printer, scanner, controller)
}

function printStatusTable(printer: (fmt: string, ...args: any[]) => void, targets: readonly Target[]) {
    const cols: TableColumn[][] = [
        [
            {hTpl: '%19s', dTpl: '%19s', h: 'Host', k: {}, d: targets.map(o => o.name)},
            {
                hTpl: '%4s',
                dTpl: '%4s',
                h: 'Todo',
                k: {},
                d: targets.map(o => attacks.map(a => o.actionsToExecute.includes(a) ? a.charAt(0) : " ").join(""))
            },
            {
                hTpl: '%4s',
                dTpl: '%4s',
                h: 'Work',
                k: {},
                d: targets.map(o => attacks.map(a => o.runningActions.includes(a) ? a.charAt(0) : " ").join(""))
            },
        ],
        [
            {hTpl: '%1s', dTpl: '%1s', h: '↘', k: {}, d: targets.map(() => " ")},
            {
                hTpl: '%11s',
                dTpl: '%4d / %4d',
                h: 'threads',
                k: {},
                d: targets.map(o => [o.isGettingWeakenedBy, o.threadsToWeaken])
            },
            {
                hTpl: '%10s',
                dTpl: '%5.2f / %2d',
                h: 'security',
                k: {},
                d: targets.map(o => [o.securityLevel, o.minSecurityLevel])
            },
            {hTpl: '%7s', dTpl: '%7s', h: 'time(s)', k: {}, d: targets.map(o => [formatTime(o.timeToWeaken * 1000)])},
        ], [
            {hTpl: '%1s', dTpl: '%1s', h: '↗', k: {}, d: targets.map(() => " ")},
            {
                hTpl: '%13s',
                dTpl: '%5d / %5d',
                h: 'threads',
                k: {},
                d: targets.map(o => [o.isGettingGrownBy, o.threadsToGrow])
            },
            {hTpl: '%6s', dTpl: '%5d%%', h: 'factor', k: {}, d: targets.map(o => [o.growthPct])},
            {hTpl: '%7s', dTpl: '%7s', h: 'time(s)', k: {}, d: targets.map(o => [formatTime(o.timeToGrow * 1000)])},
        ], [
            {hTpl: '%1s', dTpl: '%1s', h: '$', k: {}, d: targets.map(() => " ")},
            {
                hTpl: '%11s',
                dTpl: '%4d / %4d',
                h: 'threads',
                k: {},
                d: targets.map(o => [o.isGettingHackedBy, o.threadsToHack])
            },
            {hTpl: '%7s', dTpl: '%7s', h: 'time(s)', k: {}, d: targets.map(o => [formatTime(o.timeToHack * 1000)])},
            {
                hTpl: '%23s',
                dTpl: '%10.2f / %10.2f',
                h: 'money(m)',
                k: {},
                d: targets.map(o => [o.availableMoney / 1000_000, o.maxMoney / 1000_000])
            },
            {hTpl: '%5s', dTpl: '%5.1f', h: '$(%)', k: {}, d: targets.map(o => o.availableMoney / o.maxMoney * 100)},
        ],
    ];
    printTable(printer, cols)
}


function hackServers(printer: (fmt: string, ...args: any[]) => void, hacker: Hacker) {
    printer('Hacking servers...');
    const hackResult = hacker.hackServers()
    for (const server of hackResult) {
        printer('> Hacked %s', server);
    }
    printer(' ');
}