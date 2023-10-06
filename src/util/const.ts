import {Arg} from "/src/util/args";
import {NS} from "@ns";

export class Script {
    constructor(
        public readonly name: string,
        public readonly args: Arg[] = [],
        public readonly weight: number = 1
    ) {
    }

    getArgsWithValues(ns: NS, target:string|null = null) {
        const args: (string|number)[] = [];
        for (const arg of this.args) {
            args.push('--' + arg)
            args.push(this.getValueForArg(ns, arg, target))
        }
        return args;
    }

    private getValueForArg(ns: NS, arg: Arg, server: string|null = null) {
        if (!server) {
            server = ATTACK_TARGET;
        }
        switch (arg) {
            case 'target':
                return server;
            case 'maxMoney':
                return ns.getServerMaxMoney(server);
            case 'minSecurity':
                return ns.getServerMinSecurityLevel(server);
            case 'currentSecurity':
                return ns.getServerSecurityLevel(server);
            case 'currentMoney':
                return ns.getServerMoneyAvailable(server);
            default:
                return "";
        }
    }
}

export const DEPLOYMENT = {
        ADDITIONAL_FILES: ['const.js'],
        SCRIPTS: new Map([
            [
                'weaken.js',
                new Script('weaken.js', [
                    'target',
                    'minSecurity',
                ], 0.7),
            ],
            [
                'hack.js',
                new Script('hack.js', [
                    'target',
                    'maxMoney',
                    'minSecurity',
                ]),
            ],
            [
                'grow.js',
                new Script('grow.js', [
                    'target',
                    'maxMoney',
                ], 0.7),
            ],
        ]),
    };

export const ATTACK_TARGET = "n00dles";

