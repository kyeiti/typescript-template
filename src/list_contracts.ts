import {NS} from "@ns";
import {Scanner} from "/cc/Scanner";

export async function main(ns: NS) {
    const scanner = new Scanner(ns);
    const servers = scanner.all;
    for(const server of servers) {
        for(const file of ns.ls(server, '.cct')) {
            ns.tprintf("%19s: %-40s - %s", server, ns.codingcontract.getContractType(file, server), file)
        }
    }
}