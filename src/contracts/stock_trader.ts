import {spaceShipOp} from "/util/spaceShip";

type transactions = {
    start: number,
    end: number,
    profit: number,
}

export function stockTrader(maxTransactions: number, stock: readonly number[] ) {
    const sums: transactions[][] = [];
    for (let i = 0; i < stock.length; i++) {
        sums[i] = []
        const startPoint = stock[i];
        if(stock[i+1] <= startPoint) {
            continue;
        }
        for (let j = i + 1; j < stock.length; j++) {
            if(stock[j+1] > stock[j]) {
                continue;
            }
            const profit = stock[j] - startPoint;
            if (profit > (sums[i][sums[i].length - 1]?.profit ?? 0)) {
                sums[i].push({
                    start: i,
                    end: j,
                    profit: profit,
                });
            }
        }
    }
    const allPossiblePaths = possibleSums(sums)
    const maxProfits = allPossiblePaths.map(t => t.sort((a, b) => spaceShipOp(a, b, o => o.profit))
        .reverse()
        .slice(0, maxTransactions)
        .map(t => t.profit)
        .reduce((p, c) => p + c, 0))
    return maxProfits.sort(spaceShipOp).reverse()[0]
}

function possibleSums(allTransactions: readonly transactions[][], settledPath: readonly transactions[] = []): transactions[][] {
    const sums = [...settledPath];
    let startDay = 0;
    if(settledPath.length > 0) {
        startDay = settledPath[settledPath.length-1].end + 1;
    }
    for(let i = startDay; i < allTransactions.length; i++) {
        if(allTransactions[i].length === 0) {
            continue
        }
        if(allTransactions[i].length > 1) {
            let allSums: transactions[][] = []
            for(const transaction of allTransactions[i]) {
                allSums = allSums.concat(possibleSums(allTransactions, sums.concat([transaction])));
            }
            return allSums;
        }
        const transaction = allTransactions[i][0];
        const overlap = firstOverlap(transaction, allTransactions);
        if(overlap) {
            let allSums: transactions[][] = possibleSums(allTransactions, sums.concat([transaction]))
            for(const transaction of overlap) {
                allSums = allSums.concat(possibleSums(allTransactions, sums.concat([transaction])));
            }
            return allSums;
        }
        sums.push(transaction)
    }
    return [sums];
}

//  -   [101,175],[2,160],[5,85],[32,180],[23,198],[78,144]
// [130,101,175,23,2,160,93,5,85,32,180,23,59,198,78,144,130, 121,135, 133, 105,149 ,48]

function firstOverlap(check: transactions, allTransactions: readonly transactions[][]) {
    for (let j = check.start + 1; j < check.end; j++) {
        if (allTransactions[j].length > 0) {
            return allTransactions[j];
        }
    }
    return null
}

export function stockTrader3(stock: readonly number[]) {
    let maxSum = stockTrader1(stock);
    for (let i = 2; i < stock.length - 1; i++) {
        const sum = stockTrader1(stock.slice(0, i)) + stockTrader1(stock.slice(i));
        if (sum > maxSum) {
            maxSum = sum;
        }
    }
    return maxSum;
}

export function stockTrader1(stock: readonly number[]) {
    let maxSum = 0;
    for (let i = 0; i < stock.length; i++) {
        const startPoint = stock[i];
        for (let j = i + 1; j < stock.length; j++) {
            const sum = stock[j] - startPoint;
            if (sum > maxSum) {
                maxSum = sum;
            }
        }
    }
    return maxSum;
}