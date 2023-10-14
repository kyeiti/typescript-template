import {NS} from "@ns";
import {Scanner, TreeNode} from "/cc/Scanner";

export async function main(ns: NS) {
    const scanner = new Scanner(ns);
    printChildren(ns, scanner.tree.children);
}

function printChildren(ns: NS, children: TreeNode[], pre = "") {
    for (const [i, child] of children.entries()) {
        let symbol = "┣";
        let symbol2 = "┃";
        if (i === children.length - 1) {
            symbol = "┗"
            symbol2 = "";
        }
        ns.tprintf("%s %s %s", pre, symbol, child.name)
        printChildren(ns, child.children, pre + " " + symbol2 + " ");
    }
}