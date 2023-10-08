import {NS} from "@ns";
import {printTable, TableColumn} from "/util/table";

export async function main(ns: NS) {
    const ramPrices: {
        i: number,
        ram: number,
        price: number
    }[] = []
    for (let i = 1; i <= 20; i++) {
        const ram = 2 ** i;
        ramPrices.push({
            i: i,
            ram: ram,
            price: ns.getPurchasedServerCost(ram)
        })
    }

    const cols: TableColumn[][] = [
        [
            {hTpl: '%2s', dTpl: '%2d', h: 'i', k: {}, d: ramPrices.map(o => o.i)},
            {hTpl: '%9s', dTpl: '%9s', h: 'ram', k: {}, d: ramPrices.map(o => ns.formatRam(o.ram))},
            {hTpl: '%10s', dTpl: '%9.3fm', h: 'price', k: {}, d: ramPrices.map(o => o.price / 1000_000)},
        ],
    ];
    printTable(ns.tprintf, cols);

    const upgradeCost = []
    const servers = ns.getPurchasedServers();
    for (const server of servers) {
        const serverRam = ns.getServerMaxRam(server);
        const serverRamFactor = Math.log2(serverRam)
        for (let i = serverRamFactor + 1; i <= 20; i++) {
            const ram = 2 ** i;
            upgradeCost.push({
                server: server,
                serverI: serverRamFactor,
                serverRam: serverRam,
                i: i,
                ram: ram,
                price: ns.getPurchasedServerUpgradeCost(server, ram)
            })
        }
    }
    const upgradeCols: TableColumn[][] = [
        [
            {hTpl: '%19s', dTpl: '%19s', h: 'host', k: {}, d: upgradeCost.map(o => o.server)},
            {hTpl: '%2s', dTpl: '%2d', h: 'i', k: {}, d: upgradeCost.map(o => o.serverI)},
            {hTpl: '%9s', dTpl: '%9s', h: 'ram', k: {}, d: upgradeCost.map(o => ns.formatRam(o.serverRam))},
        ],
        [
            {hTpl: '%2s', dTpl: '%2d', h: 'i', k: {}, d: upgradeCost.map(o => o.i)},
            {hTpl: '%9s', dTpl: '%9s', h: 'ram', k: {}, d: upgradeCost.map(o => ns.formatRam(o.ram))},
            {hTpl: '%10s', dTpl: '%9.3fm', h: 'price', k: {}, d: upgradeCost.map(o => o.price / 1000_000)},
            {hTpl: '%10s', dTpl: '%9.3fm', h: 'price', k: {}, d: upgradeCost.map(o => ramPrices[o.i-1].price / 1000_000 - ramPrices[o.serverI-1].price / 1000_000)},
        ],
    ];
    printTable(ns.tprintf, upgradeCols);
}