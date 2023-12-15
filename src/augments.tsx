import {AutocompleteData, NS} from "@ns";

const flags: [string, string | number | boolean | string[]][] = [
    ['buy', false],
    ['only-enough-rep', false],
    ['unavailable', false],
]

export function autocomplete(data: AutocompleteData, args: string[]) {
    data.flags(flags);
    return [];
}

export async function main(ns: NS) {
    const argv = ns.flags(flags);
    const buy = argv['buy'] as boolean;
    const unavailable = argv['unavailable'] as boolean;
    const onlyEnoughRep = argv['only-enough-rep'] as boolean;
    const args = []
    if(onlyEnoughRep) {
        args.push('--only-enough-rep');
    }

    if (buy) {
        if(ns.run('augments/buy.js',  1,
            ...args
        ) === 0) {
            ns.tprintf('Error failed to start buying')
        }
    }
    if (unavailable) {
        if(ns.run('augments/list_unavailable.js',  1) === 0) {
            ns.tprintf('Error failed to list')
        }
        return;
    }
    if(ns.run('augments/list.js', 1,
        ...args
    ) === 0) {
        ns.tprintf('Error failed to list')
    }
}
