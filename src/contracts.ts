import {NS} from "@ns";

type openContractTypes = "Find Largest Prime Factor" |
    "Subarray with Maximum Sum" |
    "Total Ways to Sum" |
    "Total Ways to Sum II" |
    "Merge Overlapping Intervals" |
    "Generate IP Addresses" |
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
    // for (const contract of ns.codingcontract.getContractTypes()) {
    //     // ns.codingcontract.createDummyContract(contract);
    //     ns.tprintf(contract);
    // }
    for (let i = 0; i < 1; i++) {
        ns.codingcontract.createDummyContract("Generate IP Addresses");
    }
}