import {NS} from "@ns";
import {printTable, TableColumn} from "/util/table";

const serverNames = [
    'red',
    'white',
    'blue',
    'yellow',
    'green',
    'crimson',
    'aqua',
    'white',
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
const ram = 2 ** 14;

export async function main(ns: NS) {
    const c = ns.getPurchasedServers().length;
    for(let i = c; i <= 25; i++) {
        if(ns.getPurchasedServerCost(ram) > ns.getPlayer().money) {
            return;
        }
        ns.purchaseServer(serverNames[i], ram);
    }
}