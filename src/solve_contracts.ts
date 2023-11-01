import {NS} from "@ns";
import {spiralMatrix} from "/contracts/spiral_matrix";
import {Scanner} from "/cc/Scanner";
import {stockTrader, stockTrader1, stockTrader3} from "/contracts/stock_trader_1";
import {arrayJumper2} from "/contracts/array-jumper";
import {generateIpAddresses} from "/contracts/ip-address";
import {subarraySum} from "/contracts/subarray-sum";
import {primeFactor} from "/contracts/prime-factor";
import {mergeOverlap} from "/contracts/merge-overlap";
import {gridPaths2, gridPaths1, shortestGridPath} from "/contracts/grid-paths";

type contractTypes = "Find Largest Prime Factor" |
    "Subarray with Maximum Sum" |
    "Total Ways to Sum" |
    "Total Ways to Sum II" |
    "Spiralize Matrix" |
    "Array Jumping Game" |
    "Array Jumping Game II" |
    "Merge Overlapping Intervals" |
    "Generate IP Addresses" |
    "Algorithmic Stock Trader I" |
    "Algorithmic Stock Trader II" |
    "Algorithmic Stock Trader III" |
    "Algorithmic Stock Trader IV" |
    "Minimum Path Sum in a Triangle" |
    "Unique Paths in a Grid I" |
    "Unique Paths in a Grid II" |
    "Shortest Path in a Grid" |
    "Sanitize Parentheses in Expression" |
    "Find All Valid Math Expressions" |
    "HammingCodes: Integer to Encoded Binary" |
    "HammingCodes: Encoded Binary to Integer" |
    "Proper 2-Coloring of a Graph" |
    "Compression I: RLE Compression" |
    "Compression II: LZ Decompression" |
    "Compression III: LZ Compression" |
    "Encryption I: Caesar Cipher" |
    "Encryption II: Vigenère Cipher";


export async function main(ns: NS) {
    ns.codingcontract.getContractTypes().length
    const scanner = new Scanner(ns);
    const servers = scanner.all;
    // const servers = ['home'];
    for (const server of servers) {
        for (const file of ns.ls(server, '.cct')) {
            const type = ns.codingcontract.getContractType(file, server);
            const data = ns.codingcontract.getData(file, server);

            let reward;
            switch (type) {
                case "Spiralize Matrix":
                    reward = ns.codingcontract.attempt(spiralMatrix(data), file, server)
                    break;
                case "Algorithmic Stock Trader I":
                    reward = ns.codingcontract.attempt(stockTrader1(data), file, server)
                    break;
                case "Algorithmic Stock Trader II":
                    reward = ns.codingcontract.attempt(stockTrader(data.length, data), file, server)
                    break;
                case "Algorithmic Stock Trader III":
                    reward = ns.codingcontract.attempt(stockTrader3(data), file, server)
                    break;
                case "Algorithmic Stock Trader IV":
                    reward = ns.codingcontract.attempt(stockTrader(data[0], data[1]), file, server)
                    break;
                case "Array Jumping Game":
                    reward = ns.codingcontract.attempt(arrayJumper2(data) > 0 ? 1 : 0, file, server)
                    break
                case "Array Jumping Game II":
                    reward = ns.codingcontract.attempt(arrayJumper2(data), file, server)
                    break
                case "Generate IP Addresses":
                    reward = ns.codingcontract.attempt(generateIpAddresses(data), file, server)
                    break
                case "Subarray with Maximum Sum":
                    reward = ns.codingcontract.attempt(subarraySum(data), file, server)
                    break
                case "Unique Paths in a Grid I":
                    reward = ns.codingcontract.attempt(gridPaths1(data), file, server);
                    break
                case "Unique Paths in a Grid II":
                    reward = ns.codingcontract.attempt(gridPaths2(data), file, server);
                    break
                case "Shortest Path in a Grid":
                    reward = ns.codingcontract.attempt(shortestGridPath(data), file, server)
                    break;
                case "Merge Overlapping Intervals":
                    reward = ns.codingcontract.attempt(mergeOverlap(data), file, server)
                    break
                case "Find Largest Prime Factor":
                    reward = ns.codingcontract.attempt(primeFactor(data), file, server)
                    break
            }
            if (reward) {
                ns.tprintf("INFO Solved %s successfully. Reward: %s", file, reward)
            } else {
                ns.tprintf("ERROR Failed %s of type %s", file, type)
            }
        }
    }
    // ns.tprintf("%d", arrayJumper2([1,5,4,0,1,1,0,2,3,4,3,3,1,0,4,5,2,1,3]))

    // ns.tprintf("%d", stockTrader(2, [130,101,175,23,2,160,93,5,85,32,180,23,59,198,78,144,130,121,135,133,105,149,48])) // 353
    // ns.tprintf("%d", stockTrader3( ns, [130,101,175,23,2,160,93,5,85,32,180,23,59,198,78,144,130,121,135,133,105,149,48]))
    // ns.tprintf("%d", stockTrader( 2, [54,187,93,20,12,120,186,1,119,164,78,152,83,194,12,79,78,160,94,94,114,179,19,52,43,198,36,156,153,79,48,149,25,168,52,40,116,19,58,171,82,117,171,161,60,177,72,142,112])) // 379
    // ns.tprintf("%d", stockTrader3( ns, [54,187,93,20,12,120,186,1,119,164,78,152,83,194,12,79,78,160,94,94,114,179,19,52,43,198,36,156,153,79,48,149,25,168,52,40,116,19,58,171,82,117,171,161,60,177,72,142,112]))
}

