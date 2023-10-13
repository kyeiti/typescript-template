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