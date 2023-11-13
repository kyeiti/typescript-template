import {AutocompleteData, NS, Player} from "@ns";
import {AugmentationTag} from "/util/Augmentations/Augmentations";
import {formatBigNumber, formatMoney} from "/util/formatters";
import {spaceShipOp} from "/util/spaceShip";
import {HtmlTableColumn, Table} from "/GUI/Table";
import {EvaluatedAugmentation, scanAugmentations} from "/util/Augmentations/EvaluatedAugmentation";
import {AugmentationName} from "/util/AugmentationNames";
import {CSSProperties} from "react";

const wantedTags: AugmentationTag[] = [
    "hack",
    "faction rep",
    "company rep",
    "focus",
    "skill",
    "exp",
    // "hgw",
    // // "cha",
    // "port cracker",
    // // "hgw",
    // // "other"
]

const priceMult = 1.9;

const augmentationsToSkip: AugmentationName[] = [
    "Enhanced Myelin Sheathing",
    "Embedded Netburner Module Core Implant",
    "nextSENS Gene Modification",
    "Neuronal Densification",
    "Enhanced Social Interaction Implant",
    "The Black Hand",
]

const flags:  [string, string | number | boolean | string[]][] = [
    ['buy', false],
    ['only-enough-rep', false],
    ['unavailable', false],
]

export function autocomplete(data: AutocompleteData, args: string[]) {
    data.flags(flags);
    return [];
}

export async function main(ns: NS) {
    const argv = ns.flags(flags);
    const buy = argv['buy'] as boolean;
    const unavailable = argv['unavailable'] as boolean;
    const onlyEnoughRep = argv['only-enough-rep'] as boolean;
    if(unavailable) {
        showUnavailable(ns);
        return;
    }
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
    if (buy) {
        for (const augment of augmentationsToGet) {
            if (augment.canBeBoughtAt.length > 0 && !augment.bought) {
                if (!ns.singularity.purchaseAugmentation(augment.canBeBoughtAt[0], augment.augmentation.name)) {
                    break;
                }
            }
        }
    }

    toBuyTable(ns, augmentationsToGet.sort((a, b) => spaceShipOp(a, b, o => o.order)), player);
    ns.tprintf("Sum: %s", formatMoney(augmentationsToGet.reduce((p, c) => p + c.price, 0)))
}

function assignNextSpot(allAugmentations: EvaluatedAugmentation[], currentAugmentation: EvaluatedAugmentation) {
    if (currentAugmentation.order > -1) {
        return;
    }
    if (currentAugmentation.bought) {
        currentAugmentation.order = Math.max(...allAugmentations.map(o => o.order)) + 1;
        currentAugmentation.price = 0;
        return;
    }
    if (currentAugmentation.augmentation.preRequisites.length > 0) {
        const preRequisites = allAugmentations.filter(a => currentAugmentation.augmentation.preRequisites.includes(a.augmentation));
        for (const preRequisite of preRequisites) {
            assignNextSpot(allAugmentations, preRequisite);
        }
    }
    currentAugmentation.order = Math.max(...allAugmentations.map(o => o.order)) + 1;
    currentAugmentation.price = currentAugmentation.augmentation.basePrice * priceMult ** currentAugmentation.order;
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
                    style={o.canBeBoughtAt.includes(f) ? {color: theme.success} : {color: theme.warning}}>{f}</div>))
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
            data: tableData.map(o => o.augmentation.factions.join(", ")),
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