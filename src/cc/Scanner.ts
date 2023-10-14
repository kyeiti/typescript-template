import {NS} from "@ns";

export type TreeNode = {
    name: string
    children: TreeNode[]
}

export class Scanner {

    constructor(private readonly ns: NS) {
    }

    get tree(): TreeNode {
        const startServer = this.ns.getHostname();
        return {
            name: startServer,
            children: this.treeChildren(startServer),
        };
    }

    get all(): string[] {
        const scans = this.ns.scan();
        for (const server of scans) {
            scans.push(...this.ns.scan(server).filter(s => !scans.includes(s)));
        }
        return scans;
    }

    get accessible(): string[] {
        return this.all.filter((s) => this.ns.hasRootAccess(s));
    }

    get targets(): string[] {
        return this.accessible.filter((s) => this.ns.getServerMaxMoney(s) > 0);
    }

    get attackers(): string[] {
        return this.accessible.filter((s) => this.ns.getServerMaxRam(s) > 0);
    }

    get factionServers(): string[] {
        return this.all
            .filter((s) => this.ns.getServerMaxMoney(s) === 0)
    }

    private treeChildren(current: string, parent?: string): TreeNode[] {
        const treeChildren: TreeNode[] = [];
        const children = this.ns.scan(current);
        for (const child of children) {
            if (child === parent) {
                continue
            }
            treeChildren.push({
                name: child,
                children: this.treeChildren(child, current)
            })
        }
        return treeChildren;
    }
}