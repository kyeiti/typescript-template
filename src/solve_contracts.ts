import {NS} from "@ns";
import {spiralMatrix} from "/contracts/spiral_matrix";
import {Scanner} from "/cc/Scanner";
import {stockTrader, stockTrader1, stockTrader3} from "/contracts/stock_trader";
import {arrayJumper2} from "/contracts/array-jumper";
import {generateIpAddresses} from "/contracts/ip-address";
import {subarraySum} from "/contracts/subarray-sum";
import {primeFactor} from "/contracts/prime-factor";
import {mergeOverlap} from "/contracts/merge-overlap";
import {gridPaths1, gridPaths2, shortestGridPath} from "/contracts/grid-paths";
import {minTrianglePathSum} from "/contracts/min-triangle-path-sum";

type ContractType = "Find Largest Prime Factor" |
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
    const scanner = new Scanner(ns);
    const servers = scanner.all;
    // const servers = ['home'];
    for (const server of servers) {
        for (const file of ns.ls(server, '.cct')) {
            const type = ns.codingcontract.getContractType(file, server) as ContractType;
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
                case "Minimum Path Sum in a Triangle":
                    reward = ns.codingcontract.attempt(minTrianglePathSum(data), file, server);
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
}

