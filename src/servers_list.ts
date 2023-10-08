import {NS} from "@ns";
import {printTable, TableColumn} from "/util/table";

export async function main(ns: NS) {
    const serverList = []
    const servers = ns.getPurchasedServers();
    for (const server of servers) {
        const serverRam = ns.getServerMaxRam(server);
        const serverRamFactor = Math.log2(serverRam)
        serverList.push({
            server: server,
            serverI: serverRamFactor,
            serverRam: serverRam,
            serverUsedRam: ns.getServerUsedRam(server),
        })
    }
    const upgradeCols: TableColumn[][] = [
        [
            {hTpl: '%19s', dTpl: '%19s', h: 'host', k: {}, d: serverList.map(o => o.server)},
            {hTpl: '%2s', dTpl: '%2d', h: 'i', k: {}, d: serverList.map(o => o.serverI)},
            {hTpl: '%9s', dTpl: '%9s', h: 'ram', k: {}, d: serverList.map(o => ns.formatRam(o.serverRam))},
            {hTpl: '%9s', dTpl: '%9s', h: 'usedRam', k: {}, d: serverList.map(o => ns.formatRam(o.serverUsedRam))},
        ],
    ];
    printTable(ns.tprintf, upgradeCols);
}