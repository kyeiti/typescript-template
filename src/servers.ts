import {AutocompleteData, NS} from "@ns";
import {formatMoney} from "/util/formatters";
import {printTable, TableColumn} from "/TUI/table";

const serverNames = [
    'red',
    'white',
    'blue',
    'yellow',
    'green',
    'crimson',
    'aqua',
    'snow',
    'navy',
    'lime',
    'almond',
    'amber',
    'apricot',
    'azure',
    'charcoal',
    'bronze',
    'cherry',
    'emerald',
    'flame',
    'fuchsia',
    'gold',
    'jade',
    'ivory',
    'lemon',
    'umber',
];

const flags: [string, string | number | boolean | string[]][] = [
    ["buy", false],
    ["list", false],
    ["targetRam", 1],
]

export async function main(ns: NS) {
    const argv = ns.flags(flags)
    const targetRam = <number>argv['targetRam'];
    const doBuy = <boolean>argv["buy"] || targetRam > 1;
    const doList = <boolean>argv['list'] || !doBuy;
    if (doBuy) {
        if (ns.getPurchasedServers().length < 25) {
            purchaseServers(ns, targetRam);
        }
        improve(ns, targetRam);
    }
    if(doList) {
        list(ns);
    }
}

export function autocomplete(data: AutocompleteData, args: string[]) {
    data.flags(flags)
    return [];
}

function improve(ns: NS, ramMultiplier: number) {
    const ram = 2 ** ramMultiplier;
    const servers = ns.getPurchasedServers();
    for (const server of servers) {
        const cost = ns.getPurchasedServerUpgradeCost(server, ram);
        if (cost <= 0) {
            continue;
        }
        if (cost > ns.getPlayer().money) {
            ns.tprintf("ERROR Not enough money to upgrade %s to %s, required money: %s", server, ns.formatRam(ram), formatMoney(cost));
            break;
        }
        ns.upgradePurchasedServer(server, ram);
        ns.tprintf("INFO Upgraded %s to %s for %s", server, ns.formatRam(ram), formatMoney(cost));
    }
}

function purchaseServers(ns: NS, ramMultiplier: number) {
    const ram = 2 ** ramMultiplier;
    const c = ns.getPurchasedServers().length;
    for (let i = c; i < 25; i++) {
        const cost = ns.getPurchasedServerCost(ram);
        if (cost > ns.getPlayer().money) {
            ns.tprintf("ERROR Not enough money to purchase %s with %s RAM - required money: %s", serverNames[i], ns.formatRam(ram), cost);
            return;
        }
        const server = ns.purchaseServer(serverNames[i], ram);
        ns.tprintf("INFO Bought %s with %s RAM for %s", server, ns.formatRam(ram), cost);
    }
}

function list(ns: NS) {
    const serverList = []
    const servers = ns.getPurchasedServers();
    for (const server of servers) {
        const serverRam = ns.getServerMaxRam(server);
        const serverRamFactor = Math.log2(serverRam)
        serverList.push({
            server: server,
            serverI: serverRamFactor,
            serverRam: ns.formatRam(serverRam),
            serverUsedRam: ns.formatRam(ns.getServerUsedRam(server)),
        })
    }
    const upgradeCols: TableColumn[][] = [
        [
            {hTpl: '%19s', dTpl: '%(server)19s', h: 'host', k: {}, d: serverList},
            {hTpl: '%7s', dTpl: '%(serverI)2d / 20', h: 'i', k: {}, d: serverList},
            {hTpl: '%9s', dTpl: '%(serverRam)9s', h: 'ram', k: {}, d: serverList},
            {hTpl: '%9s', dTpl: '%(serverUsedRam)9s', h: 'usedRam', k: {}, d: serverList},
        ],
    ];
    printTable(ns.tprintf, upgradeCols);
}