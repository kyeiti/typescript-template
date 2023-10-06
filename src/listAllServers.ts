import {NS} from "@ns";
import {getAllServers} from "/util/scan";

export async function main(ns: NS) {
    for(const s of getAllServers(ns)) {
        ns.tprintf("%s", s);
    }
}