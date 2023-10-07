import {NS} from "@ns";
import {hackServer} from '/util/functions'
import {DEPLOYMENT} from '/util/const'
import {ArgFlagArg, ArgFlags} from "/util/args";
import {Script} from "/util/Script";
import {Scanner} from "/cc/Scanner";

export async function main(ns: NS) {
  const scanner = new Scanner(ns);

  const argv: ArgFlags = ns.flags(<ArgFlagArg>[
    ['target', ''],
    ['scripts', [...DEPLOYMENT.SCRIPTS.keys()].join(",")],
    ['restartAll', false],
  ]);
  const target = argv['target'] === "" ? null : <string>argv['target']
  const restart = <boolean>argv['restartAll']
  const scripts = (<string>argv['scripts']).split(",")


  ns.tprintf('Hacking servers...');
  hackServers(ns, scanner.hackable);
  ns.tprintf(' ');

  ns.tprintf('Deploying and starting scripts...');
  const servers = scanner.accessible;

  deployScripts(ns, servers, scripts);
  startScripts(ns, servers, scripts, target, restart);
}

function hackServers(ns: NS, servers: string[]) {
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

      const result = script.start(ns, server, target, cRemainingScripts);
      if (result.started) {
        ns.tprintf('> Starting %s on %s with %d threads using %f GiB', scriptName, server, result.threads, result.usedRAM);
      } else {
        ns.tprintf('Not enough RAM to start %s on %s (%fGiB/%fGiB)', scriptName, server, result.remainingRAM, result.scriptRAM);
      }

      cRemainingScripts--;
    }
  }
}