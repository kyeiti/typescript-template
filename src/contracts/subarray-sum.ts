import {spaceShipOp} from "/util/spaceShip";

export function subarraySum(data: readonly number[]) {
    let maxSums = [...data];
    while (true) {
        const newMaxSums = [...maxSums]
        for(let i = 1; i < newMaxSums.length; i++) {
            const sum = newMaxSums[i - 1] + newMaxSums[i];
            if(sum > newMaxSums[i] && sum > newMaxSums[i-1]) {
                newMaxSums[i] = Math.max(newMaxSums[i - 1] + newMaxSums[i], newMaxSums[i])
                newMaxSums[i-1] = 0;
            }
        }
        if(maxSums.toString() === newMaxSums.toString()) {
            break;
        }
        maxSums = newMaxSums;
    }
    maxSums = maxSums.filter((n) => n !== 0)
    const allPossibleSums = []
    for(let i = 0; i < maxSums.length; i++) {
        let currentSum = maxSums[i];
        allPossibleSums.push(currentSum);
        for(let j = i + 1; j < maxSums.length; j++) {
            currentSum = currentSum + maxSums[j];
            allPossibleSums.push(currentSum);
        }
    }
    return allPossibleSums.sort(spaceShipOp).reverse()[0]
}