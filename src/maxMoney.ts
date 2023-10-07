import {NS} from "@ns";
import {Scanner} from "/cc/Scanner";

export async function main(ns: NS) {
  const scanner = new Scanner(ns);
  const servers = scanner.accessible;

  let bestServer = "";
  let maxMoney = 0;
  const maxHackingLevel = ns.getHackingLevel() / 2;

  for (const server of servers) {
    const serverHackingLevel = ns.getServerRequiredHackingLevel(server);
    const money = ns.getServerMaxMoney(server);
    if (money > maxMoney && serverHackingLevel < maxHackingLevel) {
      maxMoney = money;
      bestServer = server;
    }
  }
  ns.tprintf('Best Server: %s with %fm', bestServer, maxMoney / 1000000);
}