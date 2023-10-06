import {NS} from "@ns";
import {hackServer} from '/util/functions'
import {DEPLOYMENT, Script} from '/util/const'
import {collectAccessableServers, collectHackableServers} from "/util/scan";
import {ArgFlagArg, ArgFlags} from "/util/args";

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.tprintf('Start...');
  const argv: ArgFlags = ns.flags(<ArgFlagArg>[
    ['target', ''],
    ['scripts', [...DEPLOYMENT.SCRIPTS.keys()].join(",")],
    ['restartAll', false],
  ]);
  const target = argv['target'] === "" ? null : <string>argv['target']
  const restart = <boolean>argv['restartAll']
  const scripts = (<string>argv['scripts']).split(",")


  ns.tprintf('Hacking servers...');
  hackServers(ns);
  ns.tprintf(' ');

  ns.tprintf('Deploying and starting scripts...');
  const servers = collectAccessableServers(ns);

  deployScripts(ns, servers, scripts);
  startScripts(ns, servers, scripts, target, restart);
}

/** @param {NS} ns */
function hackServers(ns: NS) {
  const servers = collectHackableServers(ns);

  for (const server of servers) {
    ns.tprintf('%s', server);
    hackServer(ns, server);
  }
}

function deployScripts(ns: NS, servers: string[], scripts: string[]) {
  for (const server of servers) {
    for (const deploy of DEPLOYMENT.ADDITIONAL_FILES) {
      ns.scp(deploy, server);
    }
    for (const script of scripts) {
      ns.scp(script, server);
    }
  }
}

function startScripts(ns: NS, servers: string[], scripts: string[], target: string | null = null, restart = false) {
  for (const server of servers) {
    if (restart) {
      ns.killall(server, true)
    }

    const scriptsToStart = [];
    for (const script of scripts) {
      const running = ns.ps(server).filter(p => p.filename === script);
      if (running.length === 0) {
        scriptsToStart.push(script);
      }
    }


    let cRemainingScripts = scriptsToStart.length;
    for (const scriptName of scriptsToStart) {
      let script = DEPLOYMENT.SCRIPTS.get(scriptName);
      if(!script) {
        script = new Script(scriptName);
      }

      const weight = cRemainingScripts > 1 ? script.weight / cRemainingScripts : 1;
      const maxRam = ns.getServerMaxRam(server);
      if(maxRam === 0) {
        continue;
      }
      const usedRam = ns.getServerUsedRam(server)
      const availableRam = maxRam - usedRam;
      const scriptRam = ns.getScriptRam(scriptName, server);
      const threads = Math.floor(availableRam / scriptRam * weight);
      if (threads > 0) {
        ns.exec(scriptName, server, threads, ...script.getArgsWithValues(ns, target ?? server));
        ns.tprintf('> Starting %s on %s', scriptName, server)
      } else {
        ns.tprintf('Not enough RAM to start %s on %s (%fGiB/%fGiB)', scriptName, server, availableRam, scriptRam);
      }

      cRemainingScripts--;
    }
  }
}