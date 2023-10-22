
export function primeFactor(data: number) {
    console.log(data, isPrime(data));
    if(isPrime(data)) {
        return data;
    }
    const primeFactors = [];
    console.log(data)
    for(let i = 2, currentRemainingValue = data; i <= currentRemainingValue; i++) {
        if(!isPrime(i)) {
            continue
        }
        if(currentRemainingValue % i === 0) {
            primeFactors.push(i);
            currentRemainingValue = currentRemainingValue / i;
            if(isPrime(currentRemainingValue)) {
                primeFactors.push(currentRemainingValue);
                break
            }
            i--;
        }
    }
    console.log(primeFactors)
    return primeFactors[primeFactors.length-1];
}

function isPrime(num: number) {
    if(num === 2) return true
    if(num % 2 === 0) return false
    for(let i = 3, s = Math.sqrt(num); i <= s; i =  i+2) {
        if(num % i === 0) return false;
    }
    return num > 1;
}