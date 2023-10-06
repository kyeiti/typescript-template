import {NS} from "@ns";

export async function main(ns: NS) {
  const locations = ns.infiltration.getPossibleLocations();
  const infiltrations = [];
  for (const location of locations) {
    infiltrations.push(ns.infiltration.getInfiltration(location.name));
  }
  infiltrations.sort((a, b) => a.difficulty - b.difficulty);
  for(const infiltration of infiltrations) {
    ns.tprintf("%s - %s: %s", infiltration.location.city, infiltration.location.name, infiltration.difficulty)
  }
}