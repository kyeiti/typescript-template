
// let transactions = data[0]
// let prices = data[1]

export function stockTraderGH(transactions: number, prices: number[]) {
    let maxProfitAt = Array(prices.length + 1).fill(0)

    for (let t = 0; t < transactions; t++) {
        const nextMaxProfits = Array(prices.length + 1).fill(0)
        for (let i = prices.length - 2; i > -1; i--) {
            let maxProfit = 0
            for (let j = i; j < prices.length; j++) {
                maxProfit = Math.max(maxProfit, prices[j] - prices[i] + maxProfitAt[j + 1])
            }
            maxProfit = Math.max(maxProfit, nextMaxProfits[i + 1])
            nextMaxProfits[i] = maxProfit
        }
        maxProfitAt = nextMaxProfits
    }

    return maxProfitAt[0]
}