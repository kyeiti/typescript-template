import {NS} from "@ns";

const ram = 2 ** 14;

export async function main(ns: NS) {
    const servers = ns.getPurchasedServers();
    for(const server of servers) {
        if(ns.getPurchasedServerUpgradeCost(server, ram) > ns.getPlayer().money) {
            break;
        }
        ns.upgradePurchasedServer(server, ram);
    }
}