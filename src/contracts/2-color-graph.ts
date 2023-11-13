export function colorGraph(vertices: number, edges: readonly [number, number][]) {
    const colors = Array(vertices).fill(-1);
    while(colors.indexOf(-1) > -1) {
        const vertice = colors.indexOf(-1);
        colors[vertice] = 0;
        if(!colorFromVertice(vertice, edges, colors)) {
            return [];
        }
    }
    return colors;
}

function colorFromVertice(vertice: number, edges: readonly [number, number][], colors: number[]) {
    const targetColor = colors[vertice] === 0 ? 1 : 0;
    for(const edge of edges.filter(v => v[0] === vertice || v[1] === vertice)) {
        let verticeToColor = edge[0];
        if(verticeToColor === vertice) {
            verticeToColor = edge[1];
        }
        if(colors[verticeToColor] === -1) {
            colors[verticeToColor] = targetColor;
            if(!colorFromVertice(verticeToColor, edges, colors)) {
                return false;
            }
        }
        if(colors[verticeToColor] !== targetColor) {
            return false;
        }
    }
    return true
}