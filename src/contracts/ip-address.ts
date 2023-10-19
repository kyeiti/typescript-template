
export function generateIpAddresses(data: string) {
    const allPossibleCombinations = [];
    for(let i = 1; i <= 3; i++) {
        for(let j = 1; j <= 3; j++) {
            for(let k = 1; k <= 3; k++) {
                for(let l = 1; l <= 3; l++) {
                    const regex = new RegExp(`^(\\d{1,${i}})(\\d{1,${j}})(\\d{1,${k}})(\\d{1,${l}})$`, "g")
                    allPossibleCombinations.push(... data.matchAll(regex))
                }
            }
        }
    }
    const allPossibleAddresses: string[] = [];
    outer: for(const possibility of allPossibleCombinations) {
        // i = 0 is the original string, no need to look at that.
        for(let i = 1; i < possibility.length; i++) {
            if(parseInt(possibility[i]) > 255 || (possibility[i].startsWith("0") && possibility[i].length > 1)) {
                continue outer;
            }
        }
        const ip = possibility.slice(1,5).join(".")
        if(!allPossibleAddresses.includes(ip)) {
            allPossibleAddresses.push(ip);
        }
    }
    return allPossibleAddresses;
}