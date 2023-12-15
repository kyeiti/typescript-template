import {NS} from "@ns";

type openContractTypes =
    "Total Ways to Sum" |
    "Total Ways to Sum II" |
    "Sanitize Parentheses in Expression" |
    "Find All Valid Math Expressions" |
    "HammingCodes: Integer to Encoded Binary" |
    "HammingCodes: Encoded Binary to Integer" |
    "Compression II: LZ Decompression" |
    "Compression III: LZ Compression" |
    "Array Jumping Game"


export async function main(ns: NS) {
    // for (const contract of ns.codingcontract.getContractTypes()) {
    //     // ns.codingcontract.createDummyContract(contract);
    //     ns.tprintf(contract);
    // }
    for (let i = 0; i < 1; i++) {
        ns.codingcontract.createDummyContract("Array Jumping Game");

    }
}