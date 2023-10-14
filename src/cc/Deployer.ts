import {NS} from "@ns";
import {actionScripts} from "/cc/scriptConfig";

export class Deployer {
    constructor(private readonly ns: NS) {
    }

    deployTo(servers: readonly string[]) {
        const deployed = []
        for (const server of servers) {
            let filesToDeploy = []
            for(const action in actionScripts) {
                filesToDeploy.push(...actionScripts[action as keyof typeof actionScripts].neededFiles)
            }
            filesToDeploy = filesToDeploy.filter((value, index, array) => array.indexOf(value) === index)
            deployed.push({
                server: server,
                files: filesToDeploy,
                success: this.ns.scp(filesToDeploy, server),
            })
        }
        return deployed;
    }
}