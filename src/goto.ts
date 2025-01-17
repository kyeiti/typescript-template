import {NS} from "@ns";
import {connect} from "/util/connect";

export async function main(ns: NS) {
    const target = <string>ns.args[0];
    connect(ns, target);
}

export function autocomplete(data: any, args: string[]) {
    if (args.length <= 1)
        return [...data.servers];
    return [];
}