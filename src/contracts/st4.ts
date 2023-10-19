import {NS} from "@ns";
import {spaceShipOp} from "/comp/utils";
import {Answer, Contract, ContractType, Solution as ISolution} from "/contract/solution";
import {ls} from "/contract/ls";

class ClosingPrice {
    constructor(
        readonly day: number,
        readonly price: number
    ) {
    }

    toString(): string {
        // return `<Snapshot>{day:${this.day},price:${this.price}}`
        return this.price.toString()
    }

    toJSON(key?: any): number {
        return this.price
    }
}

type ChronologicalTransactions = ClosingPrice[]

class Transaction extends Array<ClosingPrice> {
    get buyPrice(): number {
        return this[0].price
    }

    get sellPrice(): number {
        return this[this.length - 1].price
    }

    get profit(): number {
        return this.sellPrice - this.buyPrice
    }
}

export async function main(ns: NS): Promise<void> {
    // const host = <string>ns.args[0]
    // const file = <string>ns.args[1]
    // const input = ns.codingcontract.getData(file, host)
    // const solution = new Solution(ns);
    // const result = solution.solve(input)
    // ns.tprintf('result: %d', result)
    test(ns)
}

// function test(ns: NS) {
//   const cc = ns.codingcontract;
//   cc.createDummyContract(Solution.type)
//   ls(ns)
//     .filter(c => c.host === HOME)
//     .filter(c => c.type === Solution.type)
//     .forEach(c => {
//       const solution = new Solution(ns, c)
//       const answer = solution.solve()
//       const result = c.attempt(answer)
//       ns.tprintf('file: %-19s; answer: %4d; result: %s', c.file, answer, result)
//     })
// }

function test(ns: NS) {
    // ns.codingcontract.createDummyContract(Solution.TYPE)
    return ls(ns)
        .filter(c => c.host === HOME)
        .filter(c => c.type === Solution.TYPE)
        // .filter(c => c.file === 'contract-88153.cct')
        .map(c => new Solution(ns, c).attempt())
}

class Candidate {
    constructor(
        readonly idx: number,
        readonly transactions: Transaction[],
    ) {
    }

    private get firstTx() {
        return this.transactions[0];
    }

    private get lastTx() {
        return this.transactions[this.transactions.length - 1]
    }

    get mergeProfit(): number {
        return this.firstTx.buyPrice - this.lastTx.sellPrice
    }

    get splitProfit(): number {
        return this.transactions.reduce((p, c) => p + c.profit, 0)
    }

    get profitLoss(): number {
        return this.splitProfit - this.mergeProfit
    }

//   toJSON() {
//     return {idx: this.idx, length: this.transactions.length, transactions: this.transactiions}
//   }
}

class Solution implements ISolution {
    static readonly TYPE: ContractType = 'Algorithmic Stock Trader IV'
    static readonly MAX_ATTEMPTS = 10
    private readonly maxTransactions: number
    private readonly closingPrices: ChronologicalTransactions

    constructor(
        private readonly ns: NS,
        private readonly contract: Contract,
    ) {
        const data = <(number | number[])[]>contract.data;
        this.maxTransactions = <number>data[0]
        this.closingPrices = (<number[]>data[1]).map((n, i) => new ClosingPrice(i, n))
    }

    attempt() {
        const c = this.contract
        const answer = this.solve()
        const result = c.attempt(answer)
        const correct = result !== '';
        if (!correct) {
            this.ns.tprintf('ERROR Supplied incorrect answer for:\n' +
                // this.ns.tprintf('Foooooo:\n' +
                '%s\n' +
                '---\n' +
                'Host: %s\n' +
                'File: %s\n' +
                'Type: %s\n' +
                'Remaining Attempts : %d\n' +
                'Data: %s\n' +
                'Answer: %s\n' +
                'Result: %s',
                // c.description, c.host, c.file, Solution.TYPE, c.remainingAttempts, JSON.stringify(c.data), JSON.stringify(answer))
                c.description, c.host, c.file, Solution.TYPE, c.remainingAttempts, JSON.stringify(c.data), JSON.stringify(answer), JSON.stringify(result))
            return false
        }
        return true
    }

    solve(): Answer {
        // You are given the following array with two elements:
        //
        //   [8, [94,100,12,22,136,14,102,127,162,84,80,51,134,196,146,106,43,137,85,191,61,34,92,94,100,25,50,89,113]]
        //
        // The first element is an integer k.
        // The second element is an array of stock prices (which are numbers) where the i-th element represents the stock price on day i.
        //
        //   Determine the maximum possible profit you can earn using at most k transactions.
        //   A transaction is defined as buying and then selling one share of the stock.
        //   Note that you cannot engage in multiple transactions at once.
        //   In other words, you must sell the stock before you can buy it again.

        // const input: (number | number[])[] = [8, [94, 100, 12, 22, 136, 14, 102, 127, 162, 84, 80, 51, 134, 196, 146, 106, 43, 137, 85, 191, 61, 34, 92, 94, 100, 25, 50, 89, 113]];
        this.ns.tprintf('stockPrices: %s', JSON.stringify(this.closingPrices))
        const transactions: Transaction[] = []
        const prices = this.closingPrices;
        let tx: Transaction = new Transaction()
        for (let day = 0, price = prices[day]; day < prices.length; price = prices[++day]) {
            if (tx.length === 0 || tx.sellPrice <= price.price) {
                tx.push(price)
            } else if (tx.sellPrice > price.price) {
                if (tx.length > 1) {
                    transactions.push(tx)
                }
                tx = new Transaction(price)
            } else {
                throw new Error('IllegalState')
            }
        }
        if (tx.length > 1) {
            transactions.push(tx)
        }
        if (transactions.length === 0) {
            return 0;
        }
        // [[94, 100], [12, 22, 136], [14, 102, 127, 162], [84], [80], [51, 134, 196], [146], [106], [43, 137], [85, 191], [61], [34, 92, 94, 100], [25, 50, 89, 113]]

        // this.ns.tprintf('transactions: %s', JSON.stringify(transactions.map(t => [...t])))
        // for (let i = transactions.length - 1; i >= 0; i--) {
        //   if (transactions[i].length === 1) {
        //     transactions.splice(i, 1)
        //   }
        // }
        this.ns.tprintf('transactions: %s', JSON.stringify(transactions))
        // [[94, 100], [12, 13, 18], [16, 102, 127, 162], [51, 134, 196], [43, 137], [85, 191], [34, 92, 94, 100], [25, 50, 89, 113]]
        while (this.maxTransactions < transactions.length) {
            const potentialResult = [...transactions]
                .sort((a, b) => spaceShipOp(a, b, o => o.profit))
                .reverse()
                .slice(0, this.maxTransactions)
            const mergeCandidates: Candidate[] = []
            this.ns.tprintf('trying to find candidates')
            this.ns.tprintf('potential Result: %s', JSON.stringify(potentialResult))
            const maxWindowSize = transactions.length - this.maxTransactions + 1;
            for (let windowSize = 2; windowSize < maxWindowSize; windowSize++) {
                for (let i = 0; i < transactions.length - 1; i++) {
                    const window = transactions.slice(i, i + windowSize);
                    const firstTx = window[0];
                    const lastTx = window[window.length - 1];
                    const candidate = new Candidate(i, window)
                    // No more than one potentialResult-Transaction should get merged together
                    if (candidate.transactions.filter(t => potentialResult.includes(t)).length > 1) {
                        this.ns.tprintf('skipping candidate %s', JSON.stringify(candidate))
                        continue
                    }
                    if (firstTx.buyPrice > lastTx.buyPrice) {
                        this.ns.tprintf('skipping %d buy price %d>%d', i, firstTx.buyPrice, lastTx.buyPrice)
                        continue  // [94, 100], [12, 13, 18]
                    }
                    if (firstTx.sellPrice > lastTx.sellPrice) {
                        this.ns.tprintf('skipping %d sell price %d>%d', i, firstTx.sellPrice, lastTx.sellPrice)
                        continue  // [94, 100], [12, 13, 18]
                    }
                    mergeCandidates.push(candidate)
                }
            }
            if (mergeCandidates.length === 0) {
                break
            }
            const candidate = mergeCandidates
                .sort((a, b) => spaceShipOp(a, b, o => o.profitLoss))
                .reverse()[0]
            this.ns.tprintf('chosen Candidate %s', JSON.stringify(candidate))
            transactions[candidate.idx] = new Transaction(...candidate.transactions.flat())
            transactions.splice(candidate.idx + 1, candidate.transactions.length - 1)
        }
        // [[49,139],[32,32,170],[59,106,139],[125,197],[44,170],[115,136],[112,191,193],[51,81,104],[32,120],[61,174],[49,105],[46,114],[3,194]]
        this.ns.tprintf('transactions: %s', JSON.stringify(transactions))
        this.ns.tprintf('transactions.profit: %s', JSON.stringify(transactions.map(t => t.profit)))
        if (this.maxTransactions === transactions.length) {
            return transactions.reduce((p, c) => p + c.profit, 0)
        }
        return transactions
            .sort((a, b) => spaceShipOp(a, b, o => o.profit))
            .reverse()
            .slice(0, this.maxTransactions)
            .map(t => t.profit)
            .reduce((p, c) => p + c, 0)
    }
}


// stockPrices: [64,56,12,57,43,165,48,172,152,107,157,98,155,186,74,26,173,101,35,179,199,152,65,120,109,31,125]
// transactions: [[12,57],[43,165],[48,172],[107,157],[98,155,186],[26,173],[35,179,199],[65,120],[31,125]]
// trying to find candidates
// potential Result: [[35,179,199],[26,173],[48,172],[43,165],[31,125],[98,155,186],[65,120]]
// transactions: [[12,57],[43,165],[48,172],[107,157],[98,155,186],[26,173],[35,179,199],[65,120],[31,125]]
// transactions.profit: [45,122,124,50,88,147,164,55,94]
// Foooooo:
// You are given the following array with two elements:
//
//  [7, [64,56,12,57,43,165,48,172,152,107,157,98,155,186,74,26,173,101,35,179,199,152,65,120,109,31,125]]
//
//  The first element is an integer k. The second element is an array of stock prices (which are numbers) where the i-th element represents the stock price on day i.
//
//  Determine the maximum possible profit you can earn using at most k transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you can buy it again.
//
//  If no profit can be made, then the answer should be 0.
// ---
// Host: home
// File: contract-88153.cct
// Type: Algorithmic Stock Trader IV
// Remaining Attempts : 5
// Data: [7,[64,56,12,57,43,165,48,172,152,107,157,98,155,186,74,26,173,101,35,179,199,152,65,120,109,31,125]]
// Answer: 794
// Result: undefined

