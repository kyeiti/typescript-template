import { NS } from "@ns";
import { collectAccessibleServers } from '/util/scan'

export async function main(ns: NS) {
  const servers = collectAccessibleServers(ns);

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