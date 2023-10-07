import {NS} from "@ns";
import {Scanner} from "/cc/Scanner";

export async function main(ns: NS) {
    const scanner = new Scanner(ns);
    for(const s of scanner.all) {
        ns.tprintf("%s", s);
    }
}