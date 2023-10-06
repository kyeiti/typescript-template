import {Script} from "/util/Script";

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


