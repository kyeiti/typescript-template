import {NS} from "@ns";
import {scanAugmentations} from "/util/Augmentations/EvaluatedAugmentation";
import {spaceShipOp} from "/util/spaceShip";
import {augmentationsToSkip, wantedTags} from "/augments/config";
import {assignNextSpot} from "/augments/util";

const flags: [string, string | number | boolean | string[]][] = [
    ['only-enough-rep', false],
    ['buy-neuroflux', false],
]

export async function main(ns: NS) {
    const argv = ns.flags(flags);
    const onlyEnoughRep = argv['only-enough-rep'] as boolean;
    const buyNeuroFlux = argv['buy-neuroflux'] as boolean;
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

    let boughtAll = false;
    for (const augment of augmentationsToGet) {
        if (augment.canBeBoughtAt.length > 0 && !augment.bought) {
            if (!ns.singularity.purchaseAugmentation(augment.canBeBoughtAt[0], augment.augmentation.name)) {
                ns.tprintf('ERROR Failed to buy %s from %s', augment.augmentation.name, augment.canBeBoughtAt[0])
                break;
            }
            ns.tprintf('INFO Bought %s from %s', augment.augmentation.name, augment.canBeBoughtAt[0])
        }
        boughtAll = true;
    }
    if (boughtAll && buyNeuroFlux) {
        while (ns.singularity.purchaseAugmentation(player.factions[0], "NeuroFlux Governor")) {
            ns.tprintf('INFO Bought %s from %s', "NeuroFlux Governor", player.factions[0])
        }
    }
}