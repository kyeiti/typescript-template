
export const spaceShipOp = <T>(a: T, b: T, fn?: (o: T) => any): number => {
    const a1 = fn ? fn(a) : a;
    const b1 = fn ? fn(b) : b;
    return a1 === b1 ? 0 : a1 < b1 ? -1 : 1;
}