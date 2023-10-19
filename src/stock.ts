import {NS, TIX} from "@ns";
import {formatMoney} from "/util/formatTime";


export async function main(ns: NS) {
    const stock = ns.stock;
    const symbols = stock.getSymbols();
    ns.disableLog("sleep")
    while (true) {
        play(stock, symbols, ns.printf)
        await ns.sleep(1000)
    }
}

function play(stock: TIX, symbols: readonly string[], printer: (format: string, ...args: any[]) => void) {
    for (const symbol of symbols) {
        const maxShares = stock.getMaxShares(symbol)
        const owned = stock.getPosition(symbol);
        const longStock = owned[0];
        const longPrice = owned[0] * owned[1]
        const shortStock = owned[2]
        const shortPrice = owned[2] * owned[3]
        const shortGain = stock.getSaleGain(symbol, maxShares, "Short")
        const longGain = stock.getSaleGain(symbol, longStock, "Long")
        if (stock.getForecast(symbol) > 0.5) {
            if (longStock <= maxShares) {
                const buy = stock.buyStock(symbol, maxShares - longStock)
                if (buy > 0) {
                    printer("Bought %s for %s", symbol, formatMoney(buy * (maxShares - longStock)))
                }
            }
            if (shortGain > 0) {
                const sold = stock.sellShort(symbol, maxShares)
                if (sold > 0) {
                    printer("Sold %s (short) for %d profit", symbol, formatMoney(shortGain - shortPrice))
                }
            }
        } else {
            // const buy = stock.buyShort(symbol, maxShares)
            // printer("Bought %s (short) for %d", symbol, buy)
            if (longStock && longGain > longPrice) {
                const sold = stock.sellStock(symbol, longStock)
                if (sold > 0) {
                    printer("Sold %s for %s profit", symbol, formatMoney(longGain - longPrice))
                }
            }
        }
    }
}