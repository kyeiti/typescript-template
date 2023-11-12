import {NS} from "@ns";
import {Augmentation, Augmentations, AugmentationTag} from "/util/Augmentations/Augmentations";
import {Faction, FactionName} from "/util/Factions/Faction";

export type EvaluatedAugmentation = {
    available: boolean,
    wanted: boolean,
    installed: boolean,
    bought: boolean,
    order: number,
    price: number,
    canBeBoughtAt: FactionName[],
    augmentation: Augmentation
}

export function scanAugmentations(ns: NS, wantedTags: AugmentationTag[] = [], unwantedAugmentations: string[]) {
    const player = ns.getPlayer();
    const resetInfo = ns.getResetInfo();
    const factions = player.factions;
    const installedAugs = resetInfo.ownedAugs;
    const boughtAugs = ns.singularity.getOwnedAugmentations(true).filter(a => !installedAugs.has(a));
    const potentialAugmentations: EvaluatedAugmentation[] = Object.values(Augmentations).map(a => {
        let available = false;
        let wanted = false;
        const canBeBoughtAt: FactionName[] = [];
        for (const f of a.factions) {
            if (factions.includes(f)) {
                available = true;
                if(ns.singularity.getFactionRep(f) > a.requiredReputation) {
                    canBeBoughtAt.push(f)
                }
            }
        }
        if (!unwantedAugmentations.includes(a.name)) {
            if (wantedTags.length === 0) {
                wanted = true;
            }
            for (const wantedTag of wantedTags) {
                if (a.tags.includes(wantedTag)) {
                    wanted = true;
                }
            }
        }
        return {
            augmentation: a,
            available: available,
            wanted: wanted,
            installed: installedAugs.has(a.name),
            bought: boughtAugs.includes(a.name),
            canBeBoughtAt: canBeBoughtAt,
            order: -1,
            price: 0,
        }
    });
    potentialAugmentations.forEach(a => {
            if (a.augmentation.preRequisites.length > 0) {
                a.available = a.available && potentialAugmentations.filter(v => a.augmentation.preRequisites.includes(v.augmentation)).length === a.augmentation.preRequisites.length
            }
        }
    );
    return potentialAugmentations;
}