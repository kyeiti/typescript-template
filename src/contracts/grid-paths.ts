import {spaceShipOp} from "/util/spaceShip";

type Position = [number, number];
type Direction = "R" | "L" | "D" | "U";

export function gridPaths1(data: [number, number]) {
    const downs = data[0] - 1;
    const lefts = data[1] - 1;
    return fact(downs + lefts) / (fact(downs) * fact(lefts));
}

export function gridPaths2(data: readonly number[][]): number {
    const possiblePaths = walkGrid(data, [[0, 0]]);
    return possiblePaths.length;
}

export function shortestGridPath(data: readonly number[][]) {
    const possiblePaths = walkObstacleGrid(data);
    if(possiblePaths.size === 0) {
        return '';
    }
    return [...possiblePaths.keys()].sort((a,b) => spaceShipOp(a,b, o => o.length))[0];
}

function walkGrid(grid: readonly number[][], steps: readonly Position[] = [[0, 0]]) {
    const position = steps[steps.length - 1];
    let paths: Position[][] = [];
    if (grid[position[0] + 1] === undefined && grid[position[0]][position[1] + 1] === undefined) {
        return [[...steps]];
    }
    if (grid[position[0] + 1] && grid[position[0] + 1][position[1]] === 0) {
        paths = [...paths, ...walkGrid(grid, [...steps, [position[0] + 1, position[1]]])]
    }
    if (grid[position[0]][position[1] + 1] === 0) {
        paths = [...paths, ...walkGrid(grid, [...steps, [position[0], position[1] + 1]])]
    }
    return paths;
}

function walkObstacleGrid(grid: readonly number[][], steps: readonly Position[] = [[0, 0]], path = '') {
    const position = steps[steps.length - 1];
    let paths: Map<string, readonly Position[]> = new Map();
    if (position[0] === grid.length - 1 && position[1] === grid[0].length - 1) {
        return new Map([[path, steps]]);
    }
    if (canStepInDirection(grid, steps, "R")) {
        paths = new Map([...paths.entries(), ...walkObstacleGrid(grid, [...steps, nextPosition(position, "R")], path + "R").entries()])
    } else if (canStepInDirection(grid, steps, "L")) {
        paths = new Map([...paths.entries(),  ...walkObstacleGrid(grid, [...steps, nextPosition(position, "L")], path + "L").entries()])
    }
    if (canStepInDirection(grid, steps, "D")) {
        paths = new Map([...paths.entries(),  ...walkObstacleGrid(grid, [...steps, nextPosition(position, "D")], path + "D").entries()])
    } else if (canStepInDirection(grid, steps, "U")) {
        paths = new Map([...paths.entries(), ...walkObstacleGrid(grid, [...steps, nextPosition(position, "U")], path + "U").entries()])
    }
    return paths;
}

function canStepInDirection(grid: readonly number[][], previousSteps: readonly Position[], direction: Direction) {
    const position = previousSteps[previousSteps.length - 1];
    const newPosition: Position = nextPosition(position, direction);
    if(grid[newPosition[0]] === undefined) {
        return false;
    }
    if(grid[newPosition[0]][newPosition[1]] !== 0) {
        return false;
    }
    if(isPreviousPosition(previousSteps, newPosition)) {
        return false
    }
    return true;
}

function nextPosition(position: Position, direction: Direction ): Position {
    let movement = [0, 0];
    switch (direction) {
        case "D":
            movement = [1, 0];
            break
        case "U":
            movement = [-1, 0]
            break
        case "R":
            movement = [0, 1]
            break
        case "L":
            movement = [0, -1]
            break
    }
    return [position[0] + movement[0], position[1] + movement[1]];
}

function isPreviousPosition(steps: readonly Position[], newPosition: Position) {
    if (steps.length <= 1) {
        return false;
    }
    for (let i = steps.length - 1; i > -1; i--) {
        const previousPosition = steps[i];
        if (newPosition[0] === previousPosition[0] && newPosition[1] === previousPosition[1]) {
            return true;
        }
    }
    return false;
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