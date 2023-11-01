export function gridPaths1(data: [number, number]) {
    const downs = data[0] - 1;
    const lefts = data[1] - 1;
    return fact(downs + lefts) / (fact(downs) * fact(lefts));
}

export function gridPaths2(data: readonly number[][]): number {
    const possiblePaths = walkGrid(data,  [[0,0]]);
    return possiblePaths.length;
}

function walkGrid(grid: readonly number[][], steps: readonly [number, number][] = [[0,0]]) {
    const position = steps[steps.length -1];
    let paths: [number, number][][] = [];
    if(grid[position[0] + 1] === undefined && grid[position[0]][position[1] + 1] === undefined) {
        return [[...steps]];
    }
    if(grid[position[0] + 1] && grid[position[0] + 1][position[1]] === 0) {
        paths = [...paths, ...walkGrid(grid, [...steps, [position[0] + 1, position[1]]])]
    }
    if(grid[position[0]][position[1] + 1] === 0) {
        paths = [...paths, ...walkGrid(grid, [...steps, [position[0], position[1] + 1]])]
    }
    return paths;
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