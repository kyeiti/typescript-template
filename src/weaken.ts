import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from "/util/args";

/** @param {NS} ns */
export async function main(ns: NS) {
  const argv: ArgFlags = ns.flags(<ArgFlagArg>[
    ['target', ''],
    ['minSecurity', 0]
  ]);

  const target = <string>argv['target']
  const min = <number>argv['minSecurity']
  let currentLevel = ns.getServerSecurityLevel(target);

  while (currentLevel > min) {
    await ns.weaken(target);
    currentLevel = ns.getServerSecurityLevel(target);
  }
}