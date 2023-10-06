import { isServerHackable } from '/util/functions'
import {collectAccessibleServers} from "/util/scan";
import {NS} from "@ns";

export async function main(ns: NS) {
  const hosts = collectAccessibleServers(ns);
  const cores = 1;
  const threads = 1;
  const curHackLvl = ns.getHackingLevel(); // hacking level
  const secDec = ns.weakenAnalyze(threads, cores); // local
  const canHack = isServerHackable; // hacking level & ports

  const res = hosts.map(host => {
    const reqHackLvl = ns.getServerRequiredHackingLevel(host); // constant
    const maxMoney = ns.getServerMaxMoney(host); // constant
    const growthFactor = ns.getServerGrowth(host); // constant // % // base 100
    const baseSec = ns.getServerBaseSecurityLevel(host); // constant
    const minSec = ns.getServerMinSecurityLevel(host); // constant
    const curMoney = ns.getServerMoneyAvailable(host); // state tgtHost
    const curSec = ns.getServerSecurityLevel(host); // state tgtHost
    const hackLvl = reqHackLvl - curHackLvl;
    const secLvl = baseSec - curSec;
    const chance = ns.hackAnalyzeChance(host); // remote // current state // base 1
    const amount = ns.hackAnalyze(host); // remote // current state // threads * amount
    const secIncHack = ns.hackAnalyzeSecurity(threads, host); // remote
    const secIncGrow = ns.growthAnalyzeSecurity(threads, host, cores); // remote
    const timeHack = ns.getHackTime(host) / 1000 / 60; // remote // remote sec lvl // hacking level
    const timeGrow = ns.getGrowTime(host) / 1000 / 60; // remote // remote sec lvl // hacking level
    const timeWeaken = ns.getWeakenTime(host) / 1000 / 60; // remote // remote sec lvl // hacking level
    const money = {
      max: maxMoney,
      cur: curMoney,
      pct: curMoney / maxMoney,
    }
    const time = {
      'hack': timeHack,
      'grow': timeGrow,
      'weaken': timeWeaken,
    }

    const security = {
      secLvlDiff: secLvl,
      duration: secLvl - curHackLvl,
      secIncHack: secIncHack,
      secIncGrow: secIncGrow,
    }
    const hack = {
      lvlDiff: hackLvl,
      lvlDifficulty: hackLvl,
      growth: growthFactor,
      chance: chance,
      amount: amount,
    }
    const secDecFactor = secDec / timeWeaken; // curSec - baseSec - curHackLvl
    const rewardHack = chance * amount / timeHack; // curSec - baseSec - curHackLvl
    const penaltyHack = secIncHack;
    const rewardGrow = growthFactor / timeGrow; // curSec - baseSec - curHackLvl
    const penaltyGrow = secIncGrow;
    const profit = rewardHack + rewardGrow;
    const secInc = secIncHack + secIncGrow;
    //
    return {
      money: money,
      time: time,
      'security': security,
      'hack': hack,
      host: host, canHack: canHack(ns, host), maxMoney: maxMoney,
      growthFactor: growthFactor / 100, relMoney: curMoney / maxMoney, secDecFactor: secDecFactor,
      rewardHack: rewardHack, penaltyHack: penaltyHack, rewardGrow: rewardGrow, penaltyGrow: penaltyGrow,
      profit: profit, secInc: secInc,
    }
  });
  const headTpl = '| ' + [
    '%19s', '%4s', '%4s', '%5s',
    '%13s', '%13s', '%13s', '%14s',
    '%13s', '%14s',
  ].join(' | ') + ' |';
  const dataTpl = '| ' + [
    '%19s', '%4.2f', '%4i', '%5.3f',
    '%13.3f', '%13.3f', '%13.3f', '%14.3f',
    '%13.3f', '%14.3f',
  ].join(' | ') + ' |';
  ns.tprintf(headTpl, ...[
    'host', 'm.p', 'g ↗', 'w ↘',
    'rewardHack', 'penaltyHack', 'rewardGrow', 'penaltyGrow',
    'profit', 'secInc',
  ]);
  res.
    filter(o => o.hack.lvlDifficulty < 1 && o.money.max > 0).
    forEach(o =>
      ns.tprintf(dataTpl,
        o.host, o.money.pct, o.hack.growth, o.secDecFactor,
        o.rewardHack, o.penaltyHack, o.rewardGrow, o.penaltyGrow,
        o.profit, o.secInc,
      ));
}