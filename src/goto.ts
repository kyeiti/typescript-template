import {NS} from "@ns";
import {Scanner, TreeNode} from "/cc/Scanner";

export async function main(ns: NS) {
    const target = <string>ns.args[0];
    const scanner = new Scanner(ns);
    const tree = scanner.tree;
    let node = findInTree(tree, target);
    const connections = []
    while (node) {
        connections.push(node.name);
        node = node.parent ?? null
    }
    connections.reverse().forEach(n => ns.singularity.connect(n))
}

export function autocomplete(data: any, args: string[]) {
    if (args.length <= 1)
        return [...data.servers];
    return [];
}

function findInTree(tree: TreeNode, key: string): TreeNode | null {
    if (tree.name === key) {
        return tree;
    }
    for (const child of tree.children) {
        const found = findInTree(child, key);
        if (found) {
            return found;
        }
    }
    return null;
}