import {CSSProperties, ReactNode} from "react";
import {UserInterfaceTheme} from "@ns";

export type HtmlTableColumn = {
    header: string | ReactNode;
    data: (string | number | ReactNode)[];
    dataStyle?: CSSProperties | CSSProperties[];
};

export function Table({cols, theme}: { cols: HtmlTableColumn[], theme: UserInterfaceTheme}, ) {
    const cellStyle: CSSProperties = {border: "1px solid " + theme.primarydark, margin: 0, padding: 5};
    const headerStyle: CSSProperties = Object.assign({whiteSpace: "nowrap"}, cellStyle);
    const headers = cols.map(c => <th style={headerStyle}>{c.header}</th>)
    const data = cols.map(c =>
        c.data.map((d, i) => <td style={{ ...cellStyle, ...Array.isArray(c.dataStyle) ? c.dataStyle[i] : c.dataStyle}}>{d}</td>));
    const rows = data[0]
        .map((col, colIndex) => data.map(row => row[colIndex]))
        .map(row => <tr>{row}</tr>)

    return (
        <table style={{borderSpacing: 0, borderCollapse: "collapse"}}>
            <thead>
            <tr>
                {headers}
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </table>
    )
}