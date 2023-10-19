import {NS} from "@ns";
import {printTable, TableColumn} from "/util/table";
import {Scanner} from "/cc/Scanner";

export async function main(ns: NS) {
    const scanner = new Scanner(ns);
    const servers = scanner.factionServers;

    const upgradeCols: TableColumn[][] = [
        [
            {hTpl: '%19s', dTpl: '%19s', h: 'host', k: {}, d: servers},
        ],
    ];
    printTable(ns.tprintf, upgradeCols);
}