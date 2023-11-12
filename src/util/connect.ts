import {NS} from "@ns";
import {Scanner, TreeNode} from "/cc/Scanner";

export function connect(ns: NS, target: string) {
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