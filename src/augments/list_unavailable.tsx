import {NS} from "@ns";
import {EvaluatedAugmentation, scanAugmentations} from "/util/Augmentations/EvaluatedAugmentation";
import {augmentationsToSkip, wantedTags} from "/augments/config";
import {spaceShipOp} from "/util/spaceShip";
import {HtmlTableColumn, Table} from "/GUI/Table";
import {Faction} from "/GUI/Faction";
import {formatBigNumber, formatMoney} from "/util/formatters";

export async function main(ns: NS) {
    showUnavailable(ns);
}

function showUnavailable(ns: NS) {
    const potentialAugmentations = scanAugmentations(ns, wantedTags, augmentationsToSkip);
    const augmentationsToShow = potentialAugmentations
        .filter(p => p.wanted)
        .filter(p => !p.available)
        .filter(p => !p.installed)
        .sort((a, b) => spaceShipOp(a, b, o => o.augmentation.basePrice))
        .reverse()
    augmentationsToShow.forEach(a => {
        a.augmentation.preRequisites.forEach(p => {
            if (augmentationsToShow.filter(v => v.augmentation === p).length === 0) {
                augmentationsToShow.push(...potentialAugmentations.filter(v => v.augmentation === p && !v.available && !v.installed))
            }
        })
    })


    unavailableTable(ns, augmentationsToShow.sort((a, b) => spaceShipOp(a, b, o => o.order)));
}

function unavailableTable(ns: NS, tableData: EvaluatedAugmentation[]) {
    const htmlCols: HtmlTableColumn[] = [
        {
            header: 'Augmentation',
            data: tableData.map(o => o.augmentation.name)
        },
        {
            header: 'Factions',
            data: tableData.map(o => o.augmentation.factions.map(f => <Faction name={f} />)),
        },
        {
            header: 'Price',
            data: tableData.map(o => formatMoney(o.augmentation.basePrice)),
            dataStyle: {whiteSpace: "nowrap", textAlign: "right"}
        },
        {
            header: 'Rep',
            data: tableData.map(o => formatBigNumber(o.augmentation.requiredReputation)),
            dataStyle: {whiteSpace: "nowrap", textAlign: "right"}
        },
        {
            header: 'Effect',
            data: tableData.map(o => o.augmentation.effects)
        },
    ];
    ns.tprintRaw(<Table cols={htmlCols} theme={ns.ui.getTheme()}/>)
}