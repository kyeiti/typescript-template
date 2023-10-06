import { NS } from "@ns";
import {PORTS, getAvailablePortCrackers} from '/util/ports';

export function isServerHackable(ns: NS, server: string) {
  if (ns.hasRootAccess(server)) {
    return false;
  }
  if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
    if (ns.getServerNumPortsRequired(server) <= getAvailablePortCrackers(ns).length) {
      return true;
    }
  }
  return false;
}

/**
 * @param {NS} ns
 * @param {string} server
 */
export function hackServer(ns: NS, server: string) {
  const crackers = getAvailablePortCrackers(ns);
  for(const cracker of crackers) {
    cracker.crack(ns, server);
  }
  if (crackers.includes(PORTS.SSH)) {
    ns.brutessh(server);
  }
  if (crackers.includes(PORTS.FTP)) {
    ns.ftpcrack(server);
  }
  ns.nuke(server);
  if (ns.getScriptRam('backdoor.js') <= ns.getServerMaxRam(server)) {
    ns.scp('backdoor.js', server);
//    ns.exec('backdoor.js', server);
  }
}


/**
 * @param {NS} ns
 * @returns {string[]}
 */

/**
 * @param {NS} ns
 * @param {string} server
 * @param {string} arg
 * @returns any
 */

