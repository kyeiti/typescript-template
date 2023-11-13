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
import {colorGraph} from "/contracts/2-color-graph";
import {encryptCaesar} from "/contracts/encryption-caesar";
import {encryptVigenere} from "/contracts/encryption-vigenere";

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
            let answer;
            switch (type) {
                case "Spiralize Matrix":
                    answer = spiralMatrix(data)
                    break;
                case "Algorithmic Stock Trader I":
                    answer = stockTrader1(data)
                    break;
                case "Algorithmic Stock Trader II":
                    answer = stockTrader(data.length, data)
                    break;
                case "Algorithmic Stock Trader III":
                    answer = stockTrader3(data)
                    break;
                case "Algorithmic Stock Trader IV":
                    answer = stockTrader(data[0], data[1])
                    break;
                case "Array Jumping Game":
                    answer = arrayJumper2(data) > 0 ? 1 : 0
                    break
                case "Array Jumping Game II":
                    answer = arrayJumper2(data)
                    break
                case "Generate IP Addresses":
                    answer = generateIpAddresses(data)
                    break
                case "Subarray with Maximum Sum":
                    answer = subarraySum(data)
                    break
                case "Unique Paths in a Grid I":
                    answer = gridPaths1(data)
                    break
                case "Unique Paths in a Grid II":
                    answer = gridPaths2(data)
                    break
                case "Shortest Path in a Grid":
                    answer = shortestGridPath(data)
                    break;
                case "Minimum Path Sum in a Triangle":
                    answer = minTrianglePathSum(data)
                    break;
                case "Merge Overlapping Intervals":
                    answer = mergeOverlap(data)
                    break
                case "Find Largest Prime Factor":
                    answer = primeFactor(data)
                    break
                case "Proper 2-Coloring of a Graph":
                    answer = colorGraph(data[0], data[1])
                    break
                case "Encryption I: Caesar Cipher":
                    answer = encryptCaesar(data[0], data[1])
                    break
                case "Encryption II: Vigenère Cipher":
                    answer = encryptVigenere(data[0], data[1])
                    break
            }
            if(answer) {
                reward = ns.codingcontract.attempt(answer, file, server)
                if (reward) {
                    ns.tprintf("INFO Solved %s successfully. Reward: %s", file, reward)
                } else {
                    ns.tprintf("ERROR Failed %s of type %s", file, type)
                }
            } else {
                ns.tprintf("WARN No solution for %s of type %s", file, type)
            }
        }
    }
}

