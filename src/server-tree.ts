import {NS} from "@ns";
import {Scanner, TreeNode} from "/cc/Scanner";
import {Hacker} from "/cc/Hacker";

export async function main(ns: NS) {
    const scanner = new Scanner(ns);
    const hacker = new Hacker(ns, scanner);
    printChildren(ns, scanner.tree.children, hacker);
}

function printChildren(ns: NS, children: TreeNode[], hacker: Hacker, pre = "") {
    for (const [i, child] of children.filter(s => !ns.getPurchasedServers().includes(s.name)).entries()) {
        const server = ns.getServer(child.name);
        let symbol = "┣";
        let symbol2 = "┃";
        if (i === children.length - 1) {
            symbol = "┗"
            symbol2 = "";
        }
        let status = "";
        if (server.purchasedByPlayer) {
            status = "#"
        } else if (server.backdoorInstalled) {
            status = "*";
        } else if (server.hasAdminRights) {
            status = "°"
        } else if (hacker.isServerHackable(server.hostname)) {
            status = "!"
        }
        ns.tprintf("%s %s %1s%s, %s, %d, %d", pre, symbol, status, child.name, server.organizationName, server.requiredHackingSkill, server.numOpenPortsRequired)
        // ns.tprintf("%s %s     %1s%1s, Required hacking skill: %5d, ports: %1d", pre, symbol3, server.hasAdminRights ? "h" : "", server.backdoorInstalled ? "b" : "", server.requiredHackingSkill, server.numOpenPortsRequired ?? 0)
        // ns.tprintf("%1s %19s, %5d, %s", server.backdoorInstalled ? '*' : "", node.name, server.requiredHackingSkill)
        printChildren(ns, child.children, hacker, pre + " " + symbol2 + " ");
    }
}