
export function primeFactor(data: number) {
    const primeFactors = [];
    console.log(data)
    for(let i = 2, currentRemainingValue = data; i <= currentRemainingValue; i++) {
        if(!isPrime(i)) {
            continue
        }
        if(currentRemainingValue % i === 0) {
            primeFactors.push(i);
            currentRemainingValue = currentRemainingValue / i;
        }
    }
    console.log(primeFactors)
    return primeFactors[primeFactors.length-1];
}

function isPrime(num: number) {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
}