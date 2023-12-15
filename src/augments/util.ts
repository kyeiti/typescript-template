import {EvaluatedAugmentation} from "/util/Augmentations/EvaluatedAugmentation";

export const priceMult = 1.9;

export function assignNextSpot(allAugmentations: EvaluatedAugmentation[], currentAugmentation: EvaluatedAugmentation) {
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