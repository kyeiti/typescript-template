import {spaceShipOp} from "/util/spaceShip";
import {NS} from "@ns";

let sumsCache: Map<number, number[][]> = new Map()
const cacheFile = "contracts/sumsCache.txt";

export function totalSums(ns: NS, data: number) {
    if(ns.fileExists(cacheFile)) {
        // sumsCache = new Map(JSON.parse(ns.read(cacheFile)))
    }
    const sum = totalSumsRec(data);
    console.log(sum)
    ns.write(cacheFile, JSON.stringify([...sumsCache.entries()]), "w");
    return sum.length
}

function totalSumsRec(num: number): number[][] {
    const cachedValue = sumsCache.get(num)
    if(cachedValue !== undefined) {
        return cachedValue;
    }
    if(num <= 1) {
        return [];
    }
    let options = [];
    for (let i = Math.ceil(num/2); i < num; i++) {
        options.push([i, num -i])
        if(i > 1) {
            totalSumsRec(i).forEach((v) => {
                    options.push([num -i, ...v].sort(spaceShipOp).reverse())
            }, options)
        }
    }
    const t: {[k: string]: any} = {}
    // @ts-ignore
    options = options.filter(( a=> !(t[a.toString()]=a in t) ));
    sumsCache.set(num, options);
    return options;
}
