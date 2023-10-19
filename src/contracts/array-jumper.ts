import {spaceShipOp} from "/util/spaceShip";

export function arrayJumper2(arr: readonly number[]) {
    const all = possiblePaths(arr)
    if(!all) {
        return 0;
    }
    return all.filter(a => !!a).sort((a,b ) => spaceShipOp(a,b, o => o.length))[0].length;
}

function possiblePaths(remainingPath: readonly number[], settledPath: readonly number[] = []): number[][] | null {
    const currentPath = [...settledPath];
    let allPaths: number[][] = []
    console.log(remainingPath)
    for (let jumpLength = 1; jumpLength <= remainingPath[0]; jumpLength++) {
        const endReached = remainingPath.length === jumpLength + 1
        console.log(remainingPath.length, jumpLength, endReached, remainingPath)
        if (endReached) {
            return [settledPath.concat([jumpLength])];
        }
        const childPaths = possiblePaths(remainingPath.slice(jumpLength), currentPath.concat([jumpLength]))
        console.log('childPath',childPaths)
        if(childPaths) {
            allPaths = allPaths.concat(childPaths)
        }
    }
    return allPaths.length > 0 ? allPaths : null;
}