export function minTrianglePathSum(data: readonly number[][]) {
    return Math.min(...allTriangleSums(data, data[0][0]))
}

function allTriangleSums(triangle: readonly number[][], currentSum: number): number[] {
    if(triangle.length <= 1) {
        return [currentSum]
    }
    const subTriangle0 = triangle.map(d => d.slice(0, -1)).slice(1)
    const subTriangle1 = triangle.map(d => d.slice(1)).slice(1)
    return [...allTriangleSums(subTriangle0, currentSum + triangle[1][0]), ...allTriangleSums(subTriangle1, currentSum + triangle[1][1])]
}