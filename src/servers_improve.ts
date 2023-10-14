import {NS} from "@ns";

const ram = 2 ** 19;

export async function main(ns: NS) {
    const servers = ns.getPurchasedServers();
    for(const server of servers) {
        const cost = ns.getPurchasedServerUpgradeCost(server, ram);
        if(cost <= 0) {
            continue;
        }
        if(cost > ns.getPlayer().money) {
            ns.tprintf("Not enough money to upgrade %s to %s, required money: %10.2fm", server, ns.formatRam(ram), cost / 1_000_000);
            break;
        }
        ns.upgradePurchasedServer(server, ram);
        ns.tprintf("Upgraded %s to %s for  %10.2fm", server, ns.formatRam(ram), cost / 1_000_000);
    }
}