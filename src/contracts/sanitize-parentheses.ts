import {string} from "fast-glob/out/utils";
import {spaceShipOp} from "/util/spaceShip";

type Pair = {
    start: number,
    end: number,
}

export function sanitizeParentheses(data: string) {
    data = rTrimUntil(data, "(", ")")
    data = lTrimUntil(data, ")", "(")
    const cOpen = data.split("(").length - 1
    const cClose = data.split(")").length - 1
    const forwardPairs: Pair[][] = []
    const backwardPairs: Pair[][] = Array(data.length).fill([]).map(() => []);
    const letterIndices: number[] = []
    for (let i = 0; i < data.length; i++) {
        forwardPairs[i] = []
        if (data[i] !== "(") {
            if (data[i] !== ")") {
                letterIndices.push(i)
            }
            continue
        }
        for (let j = i + 1; j < data.length; j++) {
            if (data[j] !== ")") {
                continue
            }
            forwardPairs[i].push({
                start: i,
                end: j,
            });

            backwardPairs[j].push({
                start: i,
                end: j,
            })
        }
    }
    const allStrings = possiblePathsOpen(forwardPairs)
        .map(a => [...new Set(a.sort(spaceShipOp))])
        .map(a => {
            let str = "";
            for (const i in a) {
                str += data[i]
            }
            return str
        })
    ;
    const allValidOpenPaths = [...new Set(possiblePathsOpen(forwardPairs)
        .map(a => [...new Set(a.concat(letterIndices).sort(spaceShipOp))])
        .map(s => s.map((i) => data[i]).join(""))
    )]

    const allValidClosePaths = [...new Set(possiblePathsClose(backwardPairs)
        .map(a => [...new Set(a.concat(letterIndices).sort(spaceShipOp))])
        .map(s => s.map((i) => data[i]).join(""))
    )];
    const allValidPaths = [...new Set(allValidClosePaths.concat(allValidOpenPaths))]

    const longest = allValidPaths.sort((a, b) => spaceShipOp(a, b, o => o.length)).reverse()[0].length
    console.log(allValidPaths.filter(p => p.length === longest))
    return allValidPaths.filter(p => p.length === longest);

}

function possiblePathsOpen(allOptions: readonly Pair[][], startIndex = 0, selectedIndices: readonly number[] = []): number[][] {
    const indices = [...selectedIndices];
    for (let i = startIndex; i < allOptions.length; i++) {
        if (allOptions[i].length === 0) {
            continue
        }
        if (allOptions[i].length > 1) {
            let allPaths: number[][] = []
            for (const pair of allOptions[i]) {
                if (!selectedIndices.includes(pair.end)) {
                    // console.log(selectedIndices, pair)
                    allPaths = allPaths.concat(possiblePathsOpen(allOptions, i + 1, indices.concat([pair.start, pair.end])));
                }
            }
            if (allPaths.length > 0) {
                return allPaths;
            }
        }
        if (!selectedIndices.includes(allOptions[i][0].end)) {
            // console.log(selectedIndices, allOptions[i][0])
            indices.push(allOptions[i][0].start, allOptions[i][0].end)
        }
    }
    return [indices];
}

function possiblePathsClose(allOptions: readonly Pair[][], startIndex = allOptions.length - 1, selectedIndices: readonly number[] = []): number[][] {
    const indices = [...selectedIndices];
    for (let i = startIndex; i > 0; i--) {
        if (allOptions[i].length === 0) {
            continue
        }
        if (allOptions[i].length > 1) {
            let allPaths: number[][] = []
            for (const pair of allOptions[i]) {
                if (!selectedIndices.includes(pair.start)) {
                    // console.log(selectedIndices, pair)
                    allPaths = allPaths.concat(possiblePathsClose(allOptions, i - 1, indices.concat([pair.start, pair.end])));
                }
            }
            if (allPaths.length > 0) {
                return allPaths;
            }
        }
        if (!selectedIndices.includes(allOptions[i][0].start)) {
            // console.log(selectedIndices, allOptions[i][0])
            indices.push(allOptions[i][0].start, allOptions[i][0].end)
        }
    }
    return [indices];
}

function rTrimUntil(data: string, toTrim: string, until: string) {
    const arr = data.split("")
    for (let i = arr.length - 1; i >= 0; i--) {
        if (until.includes(arr[i])) {
            break
        }
        if (toTrim.includes(arr[i])) {
            arr[i] = ""
        }
    }
    return arr.join("");
}

function lTrimUntil(data: string, toTrim: string, until: string) {
    const arr = data.split("")
    for (let i = 0; i < arr.length; i++) {
        if (until.includes(arr[i])) {
            break
        }
        if (toTrim.includes(arr[i])) {
            arr[i] = ""
        }
    }
    return arr.join("");
}