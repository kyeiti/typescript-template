export function encryptCaesar(plaintext: string, rotation: number) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let encrypted = "";
    for (const char of plaintext) {
        if(alphabet.indexOf(char) === -1) {
            encrypted += char;
            continue;
        }
         encrypted += alphabet[((alphabet.indexOf(char) - rotation % alphabet.length) + alphabet.length) % alphabet.length]
    }
    return encrypted;
}