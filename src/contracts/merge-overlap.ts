import {spaceShipOp} from "/util/spaceShip";

export function mergeOverlap(data: readonly number[][]) {
    let intervals:number[][] = [...data];
    for (let i = intervals.length -1; i > -1; i--) {
        const item = [...intervals[i]]
        const overlaps = intervals.filter((a, idx) => a[0] <= item[1] && a[0] >= item[0] && i !== idx);
        if(overlaps.length === 0) {
            continue
        }
        const newInterval = [ Math.min(...(overlaps.map(e => e[0])), item[0]),  Math.max(...(overlaps.map(e => e[1])), item[1])];
        intervals = intervals.filter(a => a[0] > item[1] || a[0] < item[0])
        intervals.push(newInterval)
        i = intervals.length;
    }
    return intervals.sort((a,b) => spaceShipOp(a, b, o => o[0]));
}