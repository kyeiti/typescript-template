import {NS} from "@ns";
import {printTable} from "/TUI/table";

export async function main(ns: NS) {
  const locations = ns.infiltration.getPossibleLocations();
  const infiltrations = [];
  for (const location of locations) {
    infiltrations.push(ns.infiltration.getInfiltration(location.name));
  }
  infiltrations.sort((a, b) => a.difficulty - b.difficulty);
  printTable(ns.tprintf, [
      [
        {hTpl: '%19s', dTpl: '%19s', h: "City", k: {}, d: infiltrations.map((i) => i.location.city)},
        {hTpl: '%25s', dTpl: '%25s', h: "Company", k: {}, d: infiltrations.map((i) => i.location.name)},
        {hTpl: '%5s', dTpl: '%5.3f', h: "Dif", k: {}, d: infiltrations.map((i) => i.difficulty)},
        {hTpl: '%7s', dTpl: '%7.2f', h: "SoA", k: {}, d: infiltrations.map((i) => i.reward.SoARep)},
        {hTpl: '%9s', dTpl: '%9.2f', h: "Rep", k: {}, d: infiltrations.map((i) => i.reward.tradeRep)},
      ]
  ]
  )
}