import {NS, TIX} from "@ns";
import {formatMoney} from "/util/formatters";


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
            if (shortStock > 0) {
                const sold = stock.sellShort(symbol, maxShares)
                if (sold > 0) {
                    const gain = shortGain - shortPrice;
                    const formatted= formatMoney(gain);
                    if(gain > 0) {
                        printer("INFO Sold %s (short) for %s profit", symbol, formatted)
                    } else {
                        printer("FAIL Sold %s (short) for %s loss", symbol, formatted)
                    }
                }
            }
        } else {
            // const buy = stock.buyShort(symbol, maxShares)
            // printer("Bought %s (short) for %d", symbol, buy)
            if (longStock > 0) {
                const sold = stock.sellStock(symbol, longStock)
                if (sold > 0) {
                    const gain = longGain - longPrice;
                    const formatted= formatMoney(gain);
                    if(gain > 0) {
                        printer("INFO Sold %s for %s profit", symbol, formatted)
                    } else {
                        printer("FAIL Sold %s for %s loss", symbol, formatted)
                    }
                }
            }
        }
    }
}