import {NS} from "@ns";
import {printTable, TableColumn} from "/util/table";

export async function main(ns: NS) {
    const ramPrices = []
    for(let i = 1; i <= 20; i++) {
        const ram = 2**i;
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
    printTable(ns.tprintf, cols)
}