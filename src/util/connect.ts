import {NS} from "@ns";

export async function main(ns: NS) {

}

export function autocomplete(data: any, args: string[]) {
    return [...data.servers];
}