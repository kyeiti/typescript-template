
export function spiralMatrix(matrix: readonly number[][]) {
    const data: number[][] = JSON.parse(JSON.stringify(matrix));
    const spiral = []
    while(data.length > 0) {
        spiral.push(...data[0]);
        data.splice(0, 1);
        if(data.length === 0) {
            break;
        }
        for (let i = 0; i < data.length - 1; i++) {
            const element = data[i].length - 1
            if(data[i][element] == undefined) {
                break
            }
            spiral.push(data[i][element])
            data[i].splice(element, 1)
        }
        spiral.push(...data[data.length - 1].reverse())
        data.splice(data.length - 1, 1)
        for (let i = data.length - 1; i >= 0; i--) {
            const element = 0
            if(data[i][element] == undefined) {
                break
            }
            spiral.push(data[i][element])
            data[i].splice(element, 1)
        }
    }
    return spiral;
}