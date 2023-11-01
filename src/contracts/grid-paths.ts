export function gridPaths1(data: [number, number]) {
    const downs = data[0] - 1;
    const lefts = data[1] - 1;
    return fact(downs + lefts) / (fact(downs) * fact(lefts));
}

function fact(x: number): number {
    if (x < 0) {
        return NaN;
    }
    if (x === 0) {
        return 1;
    }
    return x * fact(x - 1);
}