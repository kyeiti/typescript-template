export type TableColumn = {
    hTpl: string;
    dTpl: string;
    h: string;
    k: Record<string, string>;
    d: any[] | any[][]; // You can specify the appropriate data type here
};

export function printTable(printer: (fmt: string, ...args: any[]) => void, cols: TableColumn[][]) {
    printer(Array.from(cols
        .flat()
        .map(col => col.k)
        .filter(v => v !== null)
        .reduce((p, c) => new Map(Array.from(p.entries()).concat(Object.entries(c))), new Map<string, string>())
        .entries())
        .map(v => v.join(':').replaceAll('%', '%%'))
        .join(' '))
    const headTpl2 = '| ' + cols.map(g => g.map(c => c.hTpl).join(' | ')).join(' || ') + ' |';
    const dataTpl2 = '| ' + cols.map(g => g.map(c => c.dTpl).join(' | ')).join(' || ') + ' |';
    printer(headTpl2, ...cols
        .flat()
        .map(c => c.h))
    printer(headTpl2, ...cols
        .flat()
        .map(c => c.hTpl)
        .map(s => s.match(/^%-?(?<length>\d+).+$/))
        .map(m => (m?.groups?? {'length': '0'})['length'])
        .map(s => parseInt(s))
        .map(i => '-'.repeat(i)))
    range(cols.flat()[0].d.length)
        .forEach(i => printer(dataTpl2, ...cols
            .flat()
            .flatMap(c => c.d[i])))
}

export function bFormat(value: boolean) {
    return value ? "y" : "n"
}

// @ts-ignore
function range(stop: number): number[];
function range(start: number, stop: number): number[];
function range(start: number, stop: number, step = 1): number[] {
    if (arguments.length === 1) {
        stop = start;
        start = 0;
    }
    return Array.from(Array(stop - start), (_, i) => start + i * step);
}