import {NS, TIX} from "@ns";
import {formatMoney} from "/util/formatters";

const commissionFee = 100e3;

export async function main(ns: NS) {
    const stock = ns.stock;
    const symbols = stock.getSymbols();
    ns.disableLog("sleep")
    while (true) {
        play(stock, ns, symbols, ns.printf)
        await ns.sleep(1000)
    }
}

function play(stock: TIX, ns: NS, symbols: readonly string[], printer: (format: string, ...args: any[]) => void) {
    for (const symbol of symbols) {
        const player = ns.getPlayer();
        const maxShares = stock.getMaxShares(symbol)
        const owned = stock.getPosition(symbol);
        const longStock = owned[0];
        const longPaid = owned[0] * owned[1] + commissionFee
        const shortStock = owned[2]
        const shortPaid = owned[2] * owned[3] + commissionFee
        const shortGain = stock.getSaleGain(symbol, maxShares, "Short")
        const longGain = stock.getSaleGain(symbol, longStock, "Long")
        const longPrice = stock.getAskPrice(symbol)
        const shortPrice = stock.getBidPrice(symbol)
        const purchasableLongAmount = Math.min(Math.floor((player.money -commissionFee) / longPrice), maxShares);
        const purchasableShortAmount = Math.min(Math.floor((player.money-commissionFee) / shortPrice), maxShares);
        if (stock.getForecast(symbol) > 0.5) {
            if (purchasableLongAmount > 0) {
                const buy = stock.buyStock(symbol, purchasableLongAmount - longStock)
                if (buy > 0) {
                    printer("Bought %s for %s", symbol, formatMoney(buy * (purchasableLongAmount - longStock) + commissionFee))
                }
            }
            if (shortStock > 0) {
                const sold = stock.sellShort(symbol, maxShares)
                if (sold > 0) {
                    const gain = shortGain - shortPaid;
                    const formatted= formatMoney(gain);
                    if(gain > 0) {
                        printer("INFO Sold %s (short) for %s profit", symbol, formatted)
                    } else {
                        printer("FAIL Sold %s (short) for %s loss", symbol, formatted)
                    }
                }
            }
        } else {
            // if (shortStock <= purchasableShortAmount) {
            //     const buy = stock.buyShort(symbol, maxShares)
            //     if (buy > 0) {
            //         printer("Bought %s (short) for %d", symbol, formatMoney(buy * (purchasableShortAmount - shortStock)))
            //     }
            // }
            if (longStock > 0) {
                const sold = stock.sellStock(symbol, longStock)
                if (sold > 0) {
                    const gain = longGain - longPaid;
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