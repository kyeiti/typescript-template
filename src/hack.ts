import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from '/util/args'

export async function main(ns: NS) {
  const argv: ArgFlags = ns.flags(<ArgFlagArg>[
    ['target', ''],
    ['maxMoney', 0],
    ['minSecurity', 0],
  ]);
  const server = <string>argv['target']
  const moneyMax = <number>argv['maxMoney']
  const min = <number>argv['minSecurity'] + 1; // Give the min some distance so weakening does not take to much time from the hacking

  if (moneyMax <= 0) {
    return;
  }

  while (true) {
    if (ns.getServerSecurityLevel(server) > min) {
      await ns.weaken(server);
      continue;
    }
    if (ns.getServerMoneyAvailable(server) / moneyMax < 0.90) {
      await ns.grow(server);
      continue;
    }
    await ns.hack(server);
  }
}