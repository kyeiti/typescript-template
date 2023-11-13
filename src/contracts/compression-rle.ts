export function rleCompression(payload: string) {
    let lastChar = ""
    let charCount = 0
    let output = "";
    for (const char of payload) {
        if(char === lastChar && charCount < 9) {
            charCount++;
            continue
        }
        if(charCount > 0) {
            output += charCount + lastChar;
        }
        lastChar = char;
        charCount = 1;
    }
    if(charCount > 0) {
        output += charCount + lastChar;
    }
    return output;
}