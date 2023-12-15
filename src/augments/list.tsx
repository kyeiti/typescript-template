import {NS, Player} from "@ns";
import {EvaluatedAugmentation, scanAugmentations} from "/util/Augmentations/EvaluatedAugmentation";
import {augmentationsToSkip, wantedTags} from "/augments/config";
import {spaceShipOp} from "/util/spaceShip";
import {assignNextSpot} from "/augments/util";
import {formatBigNumber, formatMoney} from "/util/formatters";
import {CSSProperties} from "react";
import {HtmlTableColumn, Table} from "/GUI/Table";
import {Faction} from "/GUI/Faction";

const flags: [string, string | number | boolean | string[]][] = [
    ['only-enough-rep', false],
]

export async function main(ns: NS) {
    const argv = ns.flags(flags);
    const onlyEnoughRep = argv['only-enough-rep'] as boolean;
    const player = ns.getPlayer();
    const potentialAugmentations = scanAugmentations(ns, wantedTags, augmentationsToSkip);
    const augmentationsToGet = potentialAugmentations
        .filter(p => p.wanted || p.bought)
        .filter(p => p.available)
        .filter(p => !p.installed)
        .filter(p => !onlyEnoughRep || p.canBeBoughtAt.length > 0)
        .sort((a, b) => spaceShipOp(a, b, o => o.price))
        .sort((a, b) => spaceShipOp(a, b, o => o.bought))
        .reverse()
    augmentationsToGet.forEach(a => {
        a.augmentation.preRequisites.forEach(p => {
            if (augmentationsToGet.filter(v => v.augmentation === p).length === 0) {
                augmentationsToGet.push(...potentialAugmentations.filter(v => v.augmentation === p && v.available && !v.installed))
            }
        })
    })
    augmentationsToGet.forEach((v) => {
        assignNextSpot(augmentationsToGet, v)
    })
    augmentationsToGet.sort((a, b) => spaceShipOp(a, b, o => o.order))

    toBuyTable(ns, augmentationsToGet, player);
    ns.tprintf("Sum: %s", formatMoney(augmentationsToGet.reduce((p, c) => p + c.price, 0)))
}

function toBuyTable(ns: NS, tableData: EvaluatedAugmentation[], player: Player) {
    const theme = ns.ui.getTheme();
    const numberStyle: CSSProperties = {whiteSpace: "nowrap", textAlign: "right",};
    const htmlCols: HtmlTableColumn[] = [
        {
            header: '',
            data: tableData.map(o => o.order),
            dataStyle: {whiteSpace: "nowrap"}
        },
        {
            header: 'Augmentation',
            data: tableData.map(o => o.augmentation.name)
        },
        {
            header: 'Factions',
            data: tableData.map(o => o.augmentation.factions
                .filter(f => player.factions.includes(f))
                .map(f => <div
                    style={o.canBeBoughtAt.includes(f) ? {color: theme.success} : {color: theme.warning}}><Faction
                    name={f}/></div>))
        },
        {
            header: 'BPrice',
            data: tableData.map(o => formatMoney(o.augmentation.basePrice)),
            dataStyle: numberStyle
        },
        {
            header: 'Price',
            data: tableData.map(o => o.bought ? "Bought" : formatMoney(o.price)),
            dataStyle: tableData.map((o, i) => ({...numberStyle, ...(tableData.slice(0, i + 1).reduce((p, c) => p + c.price, 0) <= player.money ? {} : {color: theme.error})}))
        },
        {
            header: 'Rep',
            data: tableData.map(o => formatBigNumber(o.augmentation.requiredReputation)),
            dataStyle: tableData.map(o => ({
                ...numberStyle, ...(o.canBeBoughtAt.length > 0 ? {} : {
                    color: theme.error
                })
            }))
        },
        {
            header: 'Effect',
            data: tableData.map(o => o.augmentation.effects)
        },
    ];
    ns.tprintRaw(<Table cols={htmlCols} theme={theme}/>)
}
