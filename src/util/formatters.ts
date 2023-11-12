export function formatTime(timeInMilliseconds: number) {
    return new Date(timeInMilliseconds).toISOString().substring(11, 19).replace(/^[0:]+/, "")
}

export function formatBigNumber(num: number) {
    const symbols = [" ", "k", "m", "b", "t", "q", "Q"]
    let i: number;
    for (i = 0; (num / 1000 >= 1 || num / 1000 < -1) && i < symbols.length; i++) {
        num = num / 1000;
    }
    return num.toFixed(3) + symbols[i];
}

export function formatMoney(money: number) {
    return "$" + formatBigNumber(money);
}