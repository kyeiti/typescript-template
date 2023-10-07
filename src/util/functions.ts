import {NS} from "@ns";
import {getAvailablePortCrackers} from '/util/ports';

/**
 * @param {NS} ns
 * @param {string} server
 */
export function hackServer(ns: NS, server: string) {
  const crackers = getAvailablePortCrackers(ns);
  for(const cracker of crackers) {
    cracker.crack(ns, server);
  }
  ns.nuke(server);
  if (ns.getScriptRam('backdoor.js') <= ns.getServerMaxRam(server)) {
    ns.scp('backdoor.js', server);
//    ns.exec('backdoor.js', server);
  }
}


