import {NS} from "@ns";
import {ArgFlagArg, ArgFlags} from "/util/args";

/** @param {NS} ns */
export async function main(ns: NS) {
  const argv: ArgFlags = ns.flags(<ArgFlagArg>[
    ['target', ''],
    ['maxMoney', 0],
  ]);
  const server = <string>argv['target']
  const moneyMax = <number>argv['maxMoney']
  let currentMoney = ns.getServerMoneyAvailable(server)

  if(moneyMax <= 0) {
    return;
  }

  while (currentMoney / moneyMax < 0.99) {
    await ns.grow(server);
    currentMoney = ns.getServerMoneyAvailable(server);
    ns.printf('currentMoney: %f', currentMoney);
  }
}