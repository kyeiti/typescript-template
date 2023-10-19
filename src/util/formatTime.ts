export function formatTime(timeInMilliseconds: number) {
    return new Date(timeInMilliseconds).toISOString().substring(11, 19).replace(/^[0:]+/, "")
}

export function formatMoney(money: number) {
    const symbols = ["", "k", "m", "b", "t"]
    let i: number;
    for (i = 0; money > 1000 && i < symbols.length; i++) {
        money = money / 1000;
    }
    return money.toFixed(3) + symbols[i];
}