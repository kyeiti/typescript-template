import {NS} from "@ns";

export async function main(ns: NS) {
    for(const file of ns.ls('home', '.cct')) {
        ns.rm(file, 'home')
    }
}