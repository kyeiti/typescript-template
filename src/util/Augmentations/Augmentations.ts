import {AugmentationName} from "/util/AugmentationNames";
import {FactionNames} from "/util/Factions/FactionNames";

export type AugmentationTag =
    "hack"
    | "skill"
    | "exp"
    | "cha"
    | "combat"
    | "str"
    | "def"
    | "dex"
    | "agi"
    | "rep"
    | "company rep"
    | "faction rep"
    | "hacknet"
    | "hgw"
    | "other"
    | "crime"
    | "port cracker"
    | "bladeburner"
    | "focus"


export type Augmentation = {
    readonly name: AugmentationName,
    readonly factions: readonly FactionNames[],
    readonly basePrice: number,
    readonly requiredReputation: number,
    readonly preRequisites: readonly Augmentation[],
    readonly effects: string,
    readonly tags: readonly AugmentationTag[],
    readonly isSpecial?: boolean,
    readonly unavailableInBN?: readonly number[],
}

const CranialSignalProcessorsGen1: Augmentation = {
    name: "Cranial Signal Processors - Gen I",
    factions: [FactionNames.CyberSec, FactionNames.NiteSec],
    basePrice: 70e6,
    preRequisites: [],
    requiredReputation: 10e3,
    effects: "+5 hack skill, +1 faster hgw",
    tags: ["hack", "skill", "exp", "hgw"]
}

const CranialSignalProcessorsGen2: Augmentation = {
    name: "Cranial Signal Processors - Gen II",
    factions: [FactionNames.CyberSec, FactionNames.NiteSec],
    basePrice: 125e6,
    preRequisites: [CranialSignalProcessorsGen1],
    requiredReputation: 18750,
    effects: "+7 hack skill, +2 faster hgw, +5 hack success chance",
    tags: ["hack", "skill", "exp", "hgw"]
}

const CranialSignalProcessorsGen3: Augmentation = {
    name: "Cranial Signal Processors - Gen III",
    factions: [FactionNames.NiteSec, FactionNames.TheBlackHand, FactionNames.BitRunners],
    basePrice: 550e6,
    preRequisites: [CranialSignalProcessorsGen1, CranialSignalProcessorsGen2],
    requiredReputation: 50e3,
    effects: "+9 hack skill, +2 faster hgw, +15 hack power",
    tags: ["hack", "skill", "exp", "hgw"]
}

const CranialSignalProcessorsGen4: Augmentation = {
    name: "Cranial Signal Processors - Gen IV",
    factions: [FactionNames.TheBlackHand, FactionNames.BitRunners],
    basePrice: 1.1e9,
    preRequisites: [CranialSignalProcessorsGen1, CranialSignalProcessorsGen2, CranialSignalProcessorsGen3],
    requiredReputation: 125e3,
    effects: "+2 faster hgw, +20 hack power, +25 grow power",
    tags: ["hgw"]
}

const CranialSignalProcessorsGen5: Augmentation = {
    name: "Cranial Signal Processors - Gen V",
    factions: [FactionNames.BitRunners],
    basePrice: 2250e6,
    preRequisites: [CranialSignalProcessorsGen1, CranialSignalProcessorsGen2, CranialSignalProcessorsGen3, CranialSignalProcessorsGen4],
    requiredReputation: 250e3,
    effects: "+30 hack skill, +25 hack power, +75 grow power",
    tags: ["hack", "skill", "exp", "hgw"]
}


const EmbeddedNetburnerModule: Augmentation = {
    name: "Embedded Netburner Module",
    factions: [
        FactionNames.BitRunners,
        FactionNames.TheBlackHand,
        FactionNames.NiteSec,
        FactionNames.ECorp,
        FactionNames.MegaCorp,
        FactionNames.FulcrumSecretTechnologies,
        FactionNames.NWO,
        FactionNames.BladeIndustries,
    ],
    basePrice: 250e6,
    preRequisites: [],
    requiredReputation: 15e3,
    effects: "+8 hack skill",
    tags: ["hack", "skill"]
}


const EmbeddedNetburnerModuleCoreImplant: Augmentation = {
    name: "Embedded Netburner Module Core Implant",
    factions: [
        FactionNames.BitRunners,
        FactionNames.TheBlackHand,
        FactionNames.ECorp,
        FactionNames.MegaCorp,
        FactionNames.FulcrumSecretTechnologies,
        FactionNames.NWO,
        FactionNames.BladeIndustries,
    ],
    basePrice: 2_500e6,
    preRequisites: [EmbeddedNetburnerModule],
    requiredReputation: 175e3,
    effects: "+7 hack skill, +7 hack exp, +3 faster hgw, +3 hack success chance, +10 hack power",
    tags: ["hack", "skill", "exp", "hgw"]
};

const EmbeddedNetburnerModuleDirectMemoryAccessUpgrade: Augmentation = {
    name: "Embedded Netburner Module Direct Memory Access Upgrade",
    factions: [
        FactionNames.ECorp,
        FactionNames.MegaCorp,
        FactionNames.FulcrumSecretTechnologies,
        FactionNames.NWO,
        FactionNames.Daedalus,
        FactionNames.TheCovenant,
        FactionNames.Illuminati,
    ],
    basePrice: 7e9,
    preRequisites: [EmbeddedNetburnerModule],
    requiredReputation: 1e6,
    effects: "+20 hack success chance, +40 hack power",
    tags: ["hgw"]
};

const EmbeddedNetburnerModuleCoreV2Upgrade: Augmentation = {
    name: "Embedded Netburner Module Core V2 Upgrade",
    factions: [
        FactionNames.BitRunners,
        FactionNames.ECorp,
        FactionNames.MegaCorp,
        FactionNames.FulcrumSecretTechnologies,
        FactionNames.NWO,
        FactionNames.BladeIndustries,
        FactionNames.OmniTekIncorporated,
        FactionNames.KuaiGongInternational,
    ],
    basePrice: 4.5e9,
    preRequisites: [EmbeddedNetburnerModule, EmbeddedNetburnerModuleCoreImplant],
    requiredReputation: 1e6,
    effects: "+8 hack skill, +15 hack exp, +5 faster hgw, +5 hack success, +30 hack power",
    tags: ["hack", "skill", "exp", "hgw"]
};


const EmbeddedNetburnerModuleCoreV3Upgrade: Augmentation = {
    name: "Embedded Netburner Module Core V3 Upgrade",
    factions: [
        FactionNames.ECorp,
        FactionNames.MegaCorp,
        FactionNames.FulcrumSecretTechnologies,
        FactionNames.NWO,
        FactionNames.Daedalus,
        FactionNames.TheCovenant,
        FactionNames.Illuminati,
    ],
    basePrice: 7.5e9,
    preRequisites: [EmbeddedNetburnerModule, EmbeddedNetburnerModuleCoreImplant, EmbeddedNetburnerModuleCoreV2Upgrade],
    requiredReputation: 1.75e6,
    effects: "+10 hack skill, +25 hack exp, +5 faster hgw, +10 hack success, +40 hack power",
    tags: ["hack", "skill", "exp", "hgw"]
};

const EmbeddedNetburnerModuleAnalyzeEngine: Augmentation = {
    name: "Embedded Netburner Module Analyze Engine",
    factions: [
        FactionNames.ECorp,
        FactionNames.MegaCorp,
        FactionNames.FulcrumSecretTechnologies,
        FactionNames.NWO,
        FactionNames.Daedalus,
        FactionNames.TheCovenant,
        FactionNames.Illuminati,
    ],
    basePrice: 6e9,
    preRequisites: [EmbeddedNetburnerModule],
    requiredReputation: 625e3,
    effects: "+10 faster hgw",
    tags: ["hgw"]
}

const CombatRib1: Augmentation = {
    name: "Combat Rib I",
    factions: [
        FactionNames.SlumSnakes,
        FactionNames.TheDarkArmy,
        FactionNames.TheSyndicate,
        FactionNames.Volhaven,
        FactionNames.Ishima,
        FactionNames.OmniTekIncorporated,
        FactionNames.KuaiGongInternational,
        FactionNames.BladeIndustries,
    ],
    basePrice: 23.75e6,
    preRequisites: [],
    requiredReputation: 7500,
    effects: "+10 def skill, +10 str skill",
    tags: ["def", "str", "skill", "combat"]
};

const ComabtRib2: Augmentation = {
    name: "Combat Rib II",
    factions: [
        FactionNames.TheDarkArmy,
        FactionNames.TheSyndicate,
        FactionNames.Volhaven,
        FactionNames.OmniTekIncorporated,
        FactionNames.KuaiGongInternational,
        FactionNames.BladeIndustries,],
    basePrice: 65e6,
    preRequisites: [CombatRib1],
    requiredReputation: 18_750,
    effects: "+14 def skill, +14 str skill",
    tags: ["def", "str", "skill", "combat"]
};

const ComabtRib3: Augmentation = {
    name: "Combat Rib III",
    factions: [
        FactionNames.TheDarkArmy,
        FactionNames.TheSyndicate,
        FactionNames.OmniTekIncorporated,
        FactionNames.KuaiGongInternational,
        FactionNames.BladeIndustries,
        FactionNames.TheCovenant,
    ],
    basePrice: 1.2e8,
    preRequisites: [CombatRib1, ComabtRib2],
    requiredReputation: 3.5e4,
    effects: "+18 def skill, +18 str skill",
    tags: ["def", "str", "skill", "combat"]
};

const PCDirectNeuralInterface: Augmentation = {
    name: "PC Direct-Neural Interface",
    factions: [
        FactionNames.FourSigma,
        FactionNames.OmniTekIncorporated,
        FactionNames.ECorp,
        FactionNames.BladeIndustries,
    ],
    basePrice: 3.75e9,
    preRequisites: [],
    requiredReputation: 3.75e5,
    effects: "+30 company rep, +8 hack skill",
    tags: ["hack", "company rep", "skill"]
}

const PCDirectNeuralInterfaceOptimizationSubmodule: Augmentation = {
    name: "PC Direct-Neural Interface Optimization Submodule",
    factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.ECorp, FactionNames.BladeIndustries],
    basePrice: 4.5e9,
    preRequisites: [PCDirectNeuralInterface],
    requiredReputation: 500e3,
    effects: "+10 hack skill, +75 company rep",
    tags: ["hack", "skill", "company rep"]
}

const PCDirectNeuralInterfaceNeuroNetInjector: Augmentation = {
    name: "PC Direct-Neural Interface NeuroNet Injector",
    factions: [FactionNames.FulcrumSecretTechnologies],
    basePrice: 7.5e9,
    preRequisites: [PCDirectNeuralInterface],
    requiredReputation: 1.5e6,
    effects: "+10 hack skill, +5 faster hgw, +100 company rep",
    tags: ["hack", "skill", "company rep", "hgw"]
}

const BionicSpine: Augmentation = {
    name: "Bionic Spine",
    factions: [
        FactionNames.SpeakersForTheDead,
        FactionNames.TheSyndicate,
        FactionNames.KuaiGongInternational,
        FactionNames.OmniTekIncorporated,
        FactionNames.BladeIndustries,
    ],
    basePrice: 1.25e8,
    preRequisites: [],
    requiredReputation: 4.5e4,
    effects: "+15 combat skill",
    tags: ["skill", "agi", "str", "def", "dex", "combat"]
}

const GrapheneBionicSpineUpgrade: Augmentation = {
    name: "Graphene Bionic Spine Upgrade",
    factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.ECorp],
    basePrice: 6e9,
    preRequisites: [BionicSpine],
    requiredReputation: 1.625e6,
    effects: "+60 combat skill",
    tags: ["skill", "def", "dex", "agi", "str", "combat"]
}

const BionicLegs: Augmentation = {
    name: "Bionic Legs",
    factions: [
        FactionNames.SpeakersForTheDead,
        FactionNames.TheSyndicate,
        FactionNames.KuaiGongInternational,
        FactionNames.OmniTekIncorporated,
        FactionNames.BladeIndustries,
    ],
    basePrice: 3.75e8,
    preRequisites: [],
    requiredReputation: 1.5e5,
    effects: "+60 agi",
    tags: ["agi", "skill", "combat"]
}

const GrapheneBionicLegsUpgrade: Augmentation = {
    name: "Graphene Bionic Legs Upgrade",
    factions: [FactionNames.MegaCorp, FactionNames.ECorp, FactionNames.FulcrumSecretTechnologies],
    basePrice: 4.5e9,
    preRequisites: [BionicLegs],
    requiredReputation: 750e3,
    effects: "+150 agi skill",
    tags: ["skill", "agi", "combat"]
}

const Targeting1: Augmentation = {
    name: "Augmented Targeting I",
    factions: [
        FactionNames.SlumSnakes,
        FactionNames.TheDarkArmy,
        FactionNames.TheSyndicate,
        FactionNames.Sector12,
        FactionNames.Ishima,
        FactionNames.OmniTekIncorporated,
        FactionNames.KuaiGongInternational,
        FactionNames.BladeIndustries,
    ],
    basePrice: 15e6,
    preRequisites: [],
    requiredReputation: 5e3,
    effects: "+10 dex skill",
    tags: ["combat", "dex", "skill"]
};
const Targeting2: Augmentation = {
    name: "Augmented Targeting II",
    factions: [
        FactionNames.TheDarkArmy,
        FactionNames.TheSyndicate,
        FactionNames.Sector12,
        FactionNames.OmniTekIncorporated,
        FactionNames.KuaiGongInternational,
        FactionNames.BladeIndustries,
    ],
    basePrice: 42.5e6,
    preRequisites: [Targeting1],
    requiredReputation: 8750,
    effects: "+20 dex skill",
    tags: ["combat", "dex", "skill"]
};
const Targeting3: Augmentation = {
    name: "Augmented Targeting III",
    factions: [
        FactionNames.TheDarkArmy,
        FactionNames.TheSyndicate,
        FactionNames.OmniTekIncorporated,
        FactionNames.KuaiGongInternational,
        FactionNames.BladeIndustries,
        FactionNames.TheCovenant,
    ],
    basePrice: 115e6,
    preRequisites: [Targeting1],
    requiredReputation: 2.75e4,
    effects: "+30 dex skill",
    tags: ["combat", "dex", "skill"]
};

const LuminCloak1: Augmentation = {
    name: "LuminCloaking-V1 Skin Implant",
    factions: [FactionNames.SlumSnakes, FactionNames.Tetrads],
    requiredReputation: 1.5e3,
    basePrice: 5e6,
    preRequisites: [],
    effects: "+5 agi skill, +10 crime money",
    tags: ["agi", "skill", "crime", "combat"],
};
const LuminCloak2: Augmentation = {
    name: "LuminCloaking-V2 Skin Implant",
    factions: [FactionNames.SlumSnakes, FactionNames.Tetrads],
    requiredReputation: 5e3,
    basePrice: 3e7,
    preRequisites: [LuminCloak1],
    effects: "+10 agi skill, +10 def skill, +10 crime money",
    tags: ["agi", "def", "skill", "crime", "combat"],
};

const BranchiBlades: Augmentation = {
    name: "BrachiBlades",
    requiredReputation: 1.25e4,
    basePrice: 9e7,
    effects: "+15 str skill, +15 def skill, +10 crime success, +15 crime money",
    tags: ["str", "def", "skill", "crime", "combat"],
    factions: [FactionNames.TheSyndicate],
    preRequisites: [],
};
const GrapheneBrachiBlades: Augmentation = {
    name: "Graphene BrachiBlades Upgrade",
    requiredReputation: 2.25e5,
    basePrice: 2.5e9,
    preRequisites: [BranchiBlades],
    effects: "+40 str skill, +40 def skill, +10 crime success, +30 crime money",
    tags: ["str", "def", "skill", "crime", "combat"],
    factions: [FactionNames.SpeakersForTheDead],
};
const BionicArms: Augmentation = {
    name: "Bionic Arms",
    requiredReputation: 6.25e4,
    basePrice: 2.75e8,
    effects: "+30 str skill, +30 dex skill",
    preRequisites: [],
    tags: ["str", "dex", "combat", "skill"],
    factions: [FactionNames.Tetrads],
};
const GrapheneBionicArms: Augmentation = {
    name: "Graphene Bionic Arms Upgrade",
    requiredReputation: 5e5,
    basePrice: 3.75e9,
    preRequisites: [BionicArms],
    effects: "+85 str skill, +85 dex skill",
    tags: ["str", "dex", "skill", "combat"],
    factions: [FactionNames.TheDarkArmy],
};

const EsperEyewear: Augmentation = {
    name: "EsperTech Bladeburner Eyewear",
    requiredReputation: 1.25e3,
    basePrice: 1.65e8,
    effects: "+3 Bladeburner chance, +5 dex skill",
    tags: ["dex", "skill", "combat", "bladeburner"],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    preRequisites: [],
};
const EMS4Recombination: Augmentation = {
    name: "EMS-4 Recombination",
    requiredReputation: 2.5e3,
    basePrice: 2.75e8,
    effects: "+3 Bladeburner chance, +5 Bladeburner analysis, +2 Bladeburner stamina gain",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    preRequisites: [],
    tags: ["bladeburner"],
};
const OrionShoulder: Augmentation = {
    name: "ORION-MKIV Shoulder",
    requiredReputation: 6.25e3,
    basePrice: 5.5e8,
    effects: "+5 def skill, +5 str skill, +5 dex skill, +4 bladeburner success chance",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "combat", "dex", "def", "str", "skill"],
    preRequisites: [],
};
const HyperionV1: Augmentation = {
    name: "Hyperion Plasma Cannon V1",
    requiredReputation: 1.25e4,
    basePrice: 2.75e9,
    effects: "+6 bladeburner success chance",
    preRequisites: [],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner"],
};
const HyperionV2: Augmentation = {
    name: "Hyperion Plasma Cannon V2",
    requiredReputation: 2.5e4,
    basePrice: 5.5e9,
    effects: "+8 bladeburner success chance",
    preRequisites: [HyperionV1],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner"],
};
const GolemSerum: Augmentation = {
    name: "GOLEM Serum",
    requiredReputation: 3.125e4,
    basePrice: 1.1e10,
    effects: "+7 combat skill, +5 Bladeburner stamina gain",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "combat", "dex", "def", "str", "agi"],
    preRequisites: [],
};
const VangelisVirus: Augmentation = {
    name: "Vangelis Virus",
    requiredReputation: 1.875e4,
    basePrice: 2.75e9,
    preRequisites: [],
    effects: "+10 dex exp, +10 bladeburner anaylsis, +4 bladeburner success",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "combat", "dex", "exp"],
};
const VangelisVirus3: Augmentation = {
    name: "Vangelis Virus 3.0",
    requiredReputation: 3.75e4,
    basePrice: 1.1e10,
    preRequisites: [VangelisVirus],
    effects: "+10 def exp, +10 dex exp, +15 bladeburner anaylsis, +5 bladeburner success",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "combat", "dex", "def", "exp"],
};
const INTERLINKED: Augmentation = {
    name: "I.N.T.E.R.L.I.N.K.E.D",
    requiredReputation: 2.5e4,
    basePrice: 5.5e9,
    effects: "+5 combat exp, +10 bladeburner max stamina",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "combat", "dex", "agi", "def", "str", "exp"],
    preRequisites: [],
};
const BladeRunner: Augmentation = {
    name: "Blade's Runners",
    requiredReputation: 2e4,
    basePrice: 8.25e9,
    effects: "+5 agi skill, +5 bladeburner max stamina, +5 bladeburner staminia gain",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "agi", "skill", "combat"],
    preRequisites: [],
};
const BladeArmor: Augmentation = {
    name: "BLADE-51b Tesla Armor",
    requiredReputation: 1.25e4,
    basePrice: 1.375e9,
    effects: "+4 combat skill, +2 bladeburner stamina gain, +3 bladeburner success chance",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner"],
    preRequisites: [],
};
const BladeArmorPowerCells: Augmentation = {
    name: "BLADE-51b Tesla Armor: Power Cells Upgrade",
    requiredReputation: 1.875e4,
    basePrice: 2.75e9,
    effects: "+5 bladeburner max stamina, +2 bladeburner stamina gain, +5 bladeburner success chance",
    preRequisites: [BladeArmor],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner"],
};
const BladeArmorEnergyShielding: Augmentation = {
    name: "BLADE-51b Tesla Armor: Energy Shielding Upgrade",
    requiredReputation: 2.125e4,
    basePrice: 5.5e9,
    effects: "+5 def skill, +6 bladeburner success chance",
    preRequisites: [BladeArmor],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "def", "combat", "skill"],
};
const BladeArmorUnibeam: Augmentation = {
    name: "BLADE-51b Tesla Armor: Unibeam Upgrade",
    requiredReputation: 3.125e4,
    basePrice: 1.65e10,
    effects: "+8 bladeburner success chance",
    preRequisites: [BladeArmor],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner"],
};
const BladeArmorOmnibeam: Augmentation = {
    name: "BLADE-51b Tesla Armor: Omnibeam Upgrade",
    requiredReputation: 6.25e4,
    basePrice: 2.75e10,
    effects: "+10 bladeburner success chance",
    preRequisites: [BladeArmorUnibeam],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner"],
};
const BladeArmorIPU: Augmentation = {
    name: "BLADE-51b Tesla Armor: IPU Upgrade",
    requiredReputation: 1.5e4,
    basePrice: 1.1e9,
    effects: "+15 bladeburner analysis, +2 bladeburner success chance",
    preRequisites: [BladeArmor],
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner"],
};
const BladesSimulacrum: Augmentation = {
    name: "The Blade's Simulacrum",
    requiredReputation: 1.25e3,
    basePrice: 1.5e11,
    effects: "Allow Bladeburner actions to run in background",
    unavailableInBN: [1],
    factions: [FactionNames.Bladeburners],
    tags: ["bladeburner", "other"],
    preRequisites: [],
};

export const Augmentations: readonly Augmentation[] = [
    Targeting1,
    Targeting2,
    Targeting3,
    LuminCloak1,
    LuminCloak2,
    BranchiBlades,
    GrapheneBrachiBlades,
    BionicArms,
    GrapheneBionicArms,
    BionicLegs,
    GrapheneBionicLegsUpgrade,
    {
        name: "nextSENS Gene Modification",
        requiredReputation: 4.375e5,
        basePrice: 1.925e9,
        effects: "+20 all skill",
        tags: ["hack", "str", "def", "dex", "agi", "cha", "skill", "combat"],
        preRequisites: [],
        factions: [FactionNames.ClarkeIncorporated],
    },
    {
        name: "HemoRecirculator",
        requiredReputation: 10e3,
        basePrice: 45e6,
        effects: "+8 combat skill",
        tags: ["str", "def", "dex", "agi", "skill", "combat"],
        preRequisites: [],
        factions: [FactionNames.Tetrads, FactionNames.TheDarkArmy, FactionNames.TheSyndicate]
    },
    {
        name: "OmniTek InfoLoad",
        requiredReputation: 6.25e5,
        basePrice: 2.875e9,
        effects: "+20 hack skill, +25 hack exp",
        tags: ["hack", "skill", "exp"],
        preRequisites: [],
        factions: [FactionNames.OmniTekIncorporated],
    },
    {
        name: "Photosynthetic Cells",
        requiredReputation: 5.625e5,
        basePrice: 2.75e9,
        effects: "+40 str skill, +40 def skill, +40 agi skill",
        tags: ["str", "def", "agi", "skill", "combat"],
        preRequisites: [],
        factions: [FactionNames.KuaiGongInternational],
    },
    {
        name: "INFRARET Enhancement",
        requiredReputation: 7.5e3,
        basePrice: 3e7,
        effects: "+10 dex, +25 crime success, +10 crime money",
        preRequisites: [],
        tags: ["dex", "crime", "combat", "skill"],
        factions: [FactionNames.Ishima],
    },
    {
        name: "SmartSonar Implant",
        requiredReputation: 2.25e4,
        basePrice: 7.5e7,
        effects: "+10 dex skill, +25 dex exp, +25 crime money",
        tags: ["dex", "skill", "exp", "crime", "combat"],
        preRequisites: [],
        factions: [FactionNames.SlumSnakes],
    },
    {
        name: "Power Recirculation Core",
        requiredReputation: 2.5e4,
        basePrice: 1.8e8,
        effects: "+5 all skill, +10 exp",
        tags: ["agi", "cha", "skill", "exp", "def", "dex", "str", "hack", "combat"],
        preRequisites: [],
        factions: [FactionNames.Tetrads, FactionNames.TheDarkArmy, FactionNames.TheSyndicate, FactionNames.NWO],
    },
    {
        name: "QLink",
        requiredReputation: 1.875e6,
        basePrice: 2.5e13,
        effects: "+75 hack skill, +100 faster hgw, +150 hack chance, +300 hack money",
        tags: ["hack", "skill", "hgw"],
        preRequisites: [],
        factions: [FactionNames.Illuminati],
    },
    {
        name: "SPTN-97 Gene Modification",
        requiredReputation: 1.25e6,
        basePrice: 4.875e9,
        effects: "+75 combat skill, +15 hack skill",
        tags: ["dex", "def", "str", "agi", "skill", "hack", "combat"],
        preRequisites: [],
        factions: [FactionNames.TheCovenant],
    },
    {
        name: "ECorp HVMind Implant",
        requiredReputation: 1.5e6,
        basePrice: 5.5e9,
        effects: "+200 grow",
        factions: [FactionNames.ECorp],
        tags: ["hgw"],
        preRequisites: [],
    },
    {
        name: "The Red Pill",
        requiredReputation: 2.5e6,
        basePrice: 0,
        preRequisites: [],
        isSpecial: true,
        effects: "It's time to leave the cave.",
        tags: ["other"],
        factions: [FactionNames.Daedalus],
        unavailableInBN: [2]
    },
    {
        name: "CordiARC Fusion Reactor",
        requiredReputation: 1.125e6,
        basePrice: 5e9,
        effects: "+35 combat skill, +35 combat exp",
        factions: [FactionNames.MegaCorp],
        tags: ["dex", "def", "str", "agi", "skill", "exp", "combat"],
        preRequisites: [],
    },
    {
        name: "SmartJaw",
        requiredReputation: 3.75e5,
        basePrice: 2.75e9,
        effects: "+50 cha skill, +50 cha exp, +25 rep",
        factions: [FactionNames.BachmanAssociates],
        tags: ["cha", "skill", "exp", "rep", "company rep", "faction rep"],
        preRequisites: [],
    },
    {
        name: "Neotra",
        requiredReputation: 5.625e5,
        basePrice: 2.875e9,
        effects: "+55 str skill, +55 def skill",
        factions: [FactionNames.BladeIndustries],
        tags: ["str", "def", "skill", "combat"],
        preRequisites: [],
    },
    {
        name: "Xanipher",
        requiredReputation: 8.75e5,
        basePrice: 4.25e9,
        effects: "+20 all skill, +15 exp",
        tags: ["hack", "str", "def", "dex", "agi", "cha", "skill", "exp", "combat"],
        factions: [FactionNames.NWO],
        preRequisites: []
    },
    {
        name: "Hydroflame Left Arm",
        requiredReputation: 1.25e6,
        basePrice: 2.5e12,
        effects: "+180 str skill",
        tags: ["str", "skill", "combat"],
        factions: [FactionNames.NWO],
        preRequisites: [],
    },
    {
        name: "ADR-V1 Pheromone Gene",
        factions: [
            FactionNames.TianDiHui,
            FactionNames.TheSyndicate,
            FactionNames.NWO,
            FactionNames.MegaCorp,
            FactionNames.FourSigma,
        ],
        basePrice: 17.5e6,
        preRequisites: [],
        requiredReputation: 3750,
        effects: "+10 rep",
        tags: ["faction rep", "rep", "company rep"]
    },
    {
        name: "ADR-V2 Pheromone Gene",
        factions: [
            FactionNames.Silhouette,
            FactionNames.FourSigma,
            FactionNames.BachmanAssociates,
            FactionNames.ClarkeIncorporated,
        ],
        basePrice: 5.5e8,
        preRequisites: [],
        requiredReputation: 6.25e4,
        effects: "+20 rep",
        tags: ["faction rep", "rep", "company rep"]
    },
    {
        name: "The Shadow's Simulacrum",
        factions: [FactionNames.TheSyndicate, FactionNames.TheDarkArmy, FactionNames.SpeakersForTheDead],
        requiredReputation: 3.75e4,
        basePrice: 4e8,
        effects: "+15 rep",
        preRequisites: [],
        tags: ["rep", "faction rep", "company rep"],
    },
    {
        name: "Artificial Bio-neural Network Implant",
        factions: [FactionNames.BitRunners, FactionNames.FulcrumSecretTechnologies],
        basePrice: 3e9,
        preRequisites: [],
        requiredReputation: 275e3,
        effects: "+12 hack skill, +3 faster hgw, +15 hack power",
        tags: ["hack", "skill", "exp", "hgw"]
    },
    {
        name: "Artificial Synaptic Potentiation",
        factions: [FactionNames.TheBlackHand, FactionNames.NiteSec],
        basePrice: 80e6,
        preRequisites: [],
        requiredReputation: 6250,
        effects: "+5 hack exp, +2 faster hgw, +5 hack chance",
        tags: ["hack", "exp", "hgw"]
    },
    BionicSpine,
    {
        name: "BitRunners Neurolink",
        factions: [FactionNames.BitRunners],
        basePrice: 4_375e6,
        preRequisites: [],
        requiredReputation: 875e3,
        effects: "+15 hack skill, +20 hack exp, +5 faster hgw, +10 hack success chance, FTPCrack.exe + replaySMTP.exe",
        tags: ["hack", "skill", "exp", "hgw", "port cracker"]
    },
    {
        name: "Enhanced Social Interaction Implant",
        factions: [
            FactionNames.BachmanAssociates,
            FactionNames.NWO,
            FactionNames.ClarkeIncorporated,
            FactionNames.OmniTekIncorporated,
            FactionNames.FourSigma,
        ],
        basePrice: 1.375e9,
        preRequisites: [],
        requiredReputation: 3.75e5,
        effects: "+60 cha skill, +60 cha exp",
        tags: ["cha", "skill", "exp"]
    },
    {
        name: "BitWire",
        factions: [FactionNames.CyberSec, FactionNames.NiteSec],
        basePrice: 10e6,
        preRequisites: [],
        requiredReputation: 3750,
        effects: "+5 hack skill",
        tags: ["hack", "skill"]
    },
    {
        name: "FocusWire",
        factions: [
            FactionNames.BachmanAssociates,
            FactionNames.ClarkeIncorporated,
            FactionNames.FourSigma,
            FactionNames.KuaiGongInternational,
        ],
        preRequisites: [],
        requiredReputation: 7.5e4,
        basePrice: 9e8,
        effects: "+5 skill exp, +10 company rep, +20 work money",
        tags: [
            "hack", "def", "dex", "agi",
            "str", "exp", "company rep", "other",
            "combat"
        ],
    },
    {
        name: "CRTX42-AA Gene Modification",
        factions: [FactionNames.NiteSec],
        basePrice: 225e6,
        preRequisites: [],
        requiredReputation: 45e3,
        effects: "+8 hack skill, +15 hack exp",
        tags: ["hack", "exp", "skill"]
    },
    {
        name: "CashRoot Starter Kit",
        factions: [FactionNames.Sector12],
        basePrice: 125e6,
        preRequisites: [],
        requiredReputation: 12.5e3,
        effects: "1m + BruteSSH.exe after installing augmentations",
        tags: ["other", "port cracker"]
    },
    CombatRib1,
    ComabtRib2,
    ComabtRib3,
    CranialSignalProcessorsGen1,
    CranialSignalProcessorsGen2,
    CranialSignalProcessorsGen3,
    CranialSignalProcessorsGen4,
    CranialSignalProcessorsGen5,
    {
        name: "Neuronal Densification",
        factions: [FactionNames.ClarkeIncorporated],
        requiredReputation: 1.875e5,
        basePrice: 1.375e9,
        preRequisites: [],
        effects: "+15 hack skill, +15 hack exp, +3 faster hgw",
        tags: ["hack", "skill", "exp", "hgw"]
    },
    {
        name: "DataJack",
        factions: [
            FactionNames.BitRunners,
            FactionNames.TheBlackHand,
            FactionNames.NiteSec,
            FactionNames.Chongqing,
            FactionNames.NewTokyo,
        ],
        basePrice: 450e6,
        preRequisites: [],
        requiredReputation: 112_500,
        effects: "+25 hack power",
        tags: ["hgw"]
    },
    {
        name: "DermaForce Particle Barrier",
        factions: [FactionNames.Volhaven],
        basePrice: 50e6,
        preRequisites: [],
        requiredReputation: 15e3,
        effects: "+40 def skill",
        tags: ["combat", "def", "skill"]
    },
    EmbeddedNetburnerModule,
    EmbeddedNetburnerModuleAnalyzeEngine,
    EmbeddedNetburnerModuleCoreImplant,
    EmbeddedNetburnerModuleCoreV2Upgrade,
    EmbeddedNetburnerModuleCoreV3Upgrade,
    EmbeddedNetburnerModuleDirectMemoryAccessUpgrade,
    {
        name: "Enhanced Myelin Sheathing",
        factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.BitRunners, FactionNames.TheBlackHand],
        basePrice: 1_375e6,
        preRequisites: [],
        requiredReputation: 100e3,
        effects: "+8 hack skill, +10 hack exp, +3 faster hgw",
        tags: ["hack", "skill", "exp", "hgw"]
    },
    GrapheneBionicSpineUpgrade,
    {
        name: "Graphene Bone Lacings",
        factions: [FactionNames.FulcrumSecretTechnologies, FactionNames.TheCovenant],
        basePrice: 4.25e9,
        preRequisites: [],
        requiredReputation: 1_125e3,
        effects: "+70 str skill, +70 def skill",
        tags: ["str", "skill", "def", "combat"]
    },
    {
        name: "Hacknet Node CPU Architecture Neural-Upload",
        factions: [FactionNames.Netburners],
        basePrice: 11e6,
        preRequisites: [],
        requiredReputation: 3750,
        effects: "+15 hacknet production, -15 hacknet node cost",
        tags: ["hacknet"]
    },
    {
        name: "Hacknet Node Cache Architecture Neural-Upload",
        factions: [FactionNames.Netburners],
        basePrice: 5.5e6,
        preRequisites: [],
        requiredReputation: 2500,
        effects: "+10 hacknet production, -15 hacknet node upgrade cost",
        tags: ["hacknet"]
    },
    {
        name: "Hacknet Node Core Direct-Neural Interface",
        factions: [FactionNames.Netburners],
        basePrice: 60e6,
        preRequisites: [],
        requiredReputation: 12500,
        effects: "+45 hacknet production",
        tags: ["hacknet"]
    },
    {
        name: "Hacknet Node Kernel Direct-Neural Interface",
        factions: [FactionNames.Netburners],
        basePrice: 40e6,
        preRequisites: [],
        requiredReputation: 7500,
        effects: "+25 hacknet production",
        tags: ["hacknet"]
    },
    {
        name: "Hacknet Node NIC Architecture Neural-Upload",
        factions: [FactionNames.Netburners],
        basePrice: 4.5e6,
        preRequisites: [],
        requiredReputation: 1875,
        effects: "+10 hacknet production, -10 hacknet node cost",
        tags: ["hacknet"]
    },
    {
        name: "INFRARET Enhancement",
        factions: [FactionNames.Netburners],
        basePrice: 30e6,
        preRequisites: [],
        requiredReputation: 7500,
        effects: "+10 dex skill, +10 crime money, +25 crime success",
        tags: ["dex", "skill", "crime", "combat"]
    },
    {
        name: "NEMEAN Subdermal Weave",
        factions: [
            FactionNames.TheSyndicate,
            FactionNames.FulcrumSecretTechnologies,
            FactionNames.Illuminati,
            FactionNames.Daedalus,
            FactionNames.TheCovenant,
        ],
        basePrice: 3.25e9,
        preRequisites: [],
        requiredReputation: 875e3,
        effects: "+120 def skill",
        tags: ["skill", "def", "combat"]
    },
    {
        name: "Nanofiber Weave",
        factions: [
            FactionNames.TheDarkArmy,
            FactionNames.TheSyndicate,
            FactionNames.OmniTekIncorporated,
            FactionNames.BladeIndustries,
            FactionNames.TianDiHui,
            FactionNames.SpeakersForTheDead,
            FactionNames.FulcrumSecretTechnologies,
        ],
        basePrice: 125e6,
        preRequisites: [],
        requiredReputation: 37500,
        effects: "+20 def skill, +20 str skill",
        tags: ["def", "str", "skill", "combat"]
    },
    {
        name: "Neural Accelerator",
        factions: [FactionNames.BitRunners],
        basePrice: 1_750e6,
        preRequisites: [],
        requiredReputation: 200e3,
        effects: "+10 hack skill, +15 hack exp, +20 hack power",
        tags: ["hack", "exp", "skill", "hgw"]
    },
    {
        name: "Neural-Retention Enhancement",
        factions: [FactionNames.NiteSec],
        basePrice: 250e6,
        preRequisites: [],
        requiredReputation: 20e3,
        effects: "+25 hack exp",
        tags: ["hack", "exp"]
    },
    {
        name: "Neuralstimulator",
        factions: [
            FactionNames.TheBlackHand,
            FactionNames.Chongqing,
            FactionNames.Sector12,
            FactionNames.NewTokyo,
            FactionNames.Aevum,
            FactionNames.Ishima,
            FactionNames.Volhaven,
            FactionNames.BachmanAssociates,
            FactionNames.ClarkeIncorporated,
            FactionNames.FourSigma,
        ],
        basePrice: 3e9,
        preRequisites: [],
        requiredReputation: 50_000,
        effects: "+12 hack exp, +2 faster hgw, +10 hack success chance",
        tags: ["hack", "exp", "hgw"]
    },
    {
        name: "Neuregen Gene Modification",
        factions: [FactionNames.Chongqing],
        basePrice: 375e6,
        preRequisites: [],
        requiredReputation: 37_500,
        effects: "+40 hack exp",
        tags: ["hack", "exp"]
    },
    {
        name: "Neuroreceptor Management Implant",
        factions: [FactionNames.TianDiHui],
        basePrice: 550e6,
        preRequisites: [],
        requiredReputation: 75000,
        effects: "Remove focus penalty",
        tags: ["other", "focus"]
    },
    {
        name: "Neurotrainer I",
        factions: [FactionNames.CyberSec, FactionNames.Aevum],
        basePrice: 4e6,
        preRequisites: [],
        requiredReputation: 1000,
        effects: "+10 skill exp",
        tags: ["hack", "exp", "agi", "dex", "def", "str", "skill", "combat"]
    },
    {
        name: "Neurotrainer II",
        factions: [FactionNames.BitRunners, FactionNames.NiteSec],
        basePrice: 45e6,
        preRequisites: [],
        requiredReputation: 10e3,
        effects: "+15 skill exp",
        tags: ["hack", "exp", "agi", "dex", "def", "str", "skill", "combat"]
    },
    {
        name: "Neurotrainer III",
        factions: [FactionNames.NWO, FactionNames.FourSigma],
        basePrice: 1.3e8,
        preRequisites: [],
        requiredReputation: 25e3,
        effects: "+20 skill exp",
        tags: ["hack", "exp", "agi", "dex", "def", "str", "skill", "combat"]
    },
    {
        name: "HyperSight Corneal Implant",
        requiredReputation: 1.5e5,
        basePrice: 2.75e9,
        effects: "+40 dex skill, +3 faster hgw, +10 hack money",
        preRequisites: [],
        tags: ["dex", "combat", "hgw"],
        factions: [FactionNames.BladeIndustries, FactionNames.KuaiGongInternational],
    },
    {
        name: "Nuoptimal Nootropic Injector Implant",
        factions: [
            FactionNames.TianDiHui,
            FactionNames.Volhaven,
            FactionNames.NewTokyo,
            FactionNames.Chongqing,
            FactionNames.ClarkeIncorporated,
            FactionNames.FourSigma,
            FactionNames.BachmanAssociates,
        ],
        basePrice: 20e6,
        preRequisites: [],
        requiredReputation: 5000,
        effects: "+20 company rep",
        tags: ["company rep"]
    },
    {
        name: "NutriGen Implant",
        factions: [FactionNames.NewTokyo],
        basePrice: 2.5e6,
        preRequisites: [],
        requiredReputation: 6_250,
        effects: "+20 combat exp",
        tags: ["exp", "agi", "dex", "def", "str", "combat"]
    },
    PCDirectNeuralInterface,
    PCDirectNeuralInterfaceNeuroNetInjector,
    PCDirectNeuralInterfaceOptimizationSubmodule,
    {
        name: "PCMatrix",
        factions: [FactionNames.Aevum],
        basePrice: 2e9,
        preRequisites: [],
        requiredReputation: 100e3,
        effects: "+7.77 cha skill, +7.77 cha exp, +7.77 rep, +7.77 crime money, +7.77 crime success, +77.7 work money, DeepscanV1.exe, AutoLink.exe",
        tags: ["cha", "skill", "exp", "rep", "other", "company rep", "faction rep", "crime"]
    },
    {
        name: "Social Negotiation Assistant (S.N.A)",
        factions: [FactionNames.TianDiHui],
        basePrice: 30e6,
        preRequisites: [],
        requiredReputation: 6250,
        effects: "+15 rep, +10 work money",
        tags: ["company rep", "faction rep", "rep"]
    },
    {
        name: "Speech Enhancement",
        factions: [
            FactionNames.TianDiHui,
            FactionNames.SpeakersForTheDead,
            FactionNames.FourSigma,
            FactionNames.KuaiGongInternational,
            FactionNames.ClarkeIncorporated,
            FactionNames.BachmanAssociates,
        ],
        basePrice: 12.5e6,
        preRequisites: [],
        requiredReputation: 2500,
        effects: "+10 cha skill, +10 company rep",
        tags: ["cha", "skill", "company rep"]
    },
    {
        name: "Speech Processor Implant",
        factions: [
            FactionNames.TianDiHui,
            FactionNames.Chongqing,
            FactionNames.Sector12,
            FactionNames.NewTokyo,
            FactionNames.Aevum,
            FactionNames.Ishima,
            FactionNames.Volhaven,
            FactionNames.Silhouette,
        ],
        basePrice: 50e6,
        preRequisites: [],
        requiredReputation: 7500,
        effects: "+20 cha skill",
        tags: ["cha", "skill"]
    },
    {
        name: "Synaptic Enhancement Implant",
        factions: [FactionNames.CyberSec, FactionNames.Aevum],
        basePrice: 7.5e6,
        preRequisites: [],
        requiredReputation: 2000,
        effects: "+3 faster hgw",
        tags: ["hgw"]
    },
    {
        name: "Synfibril Muscle",
        factions: [
            FactionNames.KuaiGongInternational,
            FactionNames.FulcrumSecretTechnologies,
            FactionNames.SpeakersForTheDead,
            FactionNames.NWO,
            FactionNames.TheCovenant,
            FactionNames.Daedalus,
            FactionNames.Illuminati,
            FactionNames.BladeIndustries,
        ],
        basePrice: 1.125e9,
        preRequisites: [],
        requiredReputation: 437e3,
        effects: "+30 str skill, +30 def skill",
        tags: ["str", "skill", "def", "combat"]
    },
    {
        name: "Synthetic Heart",
        factions: [
            FactionNames.KuaiGongInternational,
            FactionNames.FulcrumSecretTechnologies,
            FactionNames.SpeakersForTheDead,
            FactionNames.NWO,
            FactionNames.TheCovenant,
            FactionNames.Daedalus,
            FactionNames.Illuminati,
        ],
        basePrice: 2.875e9,
        preRequisites: [],
        requiredReputation: 750e3,
        effects: "+50 str skill, +50 agi skill",
        tags: ["skill", "str", "agi", "combat"]
    },
    {
        name: "TITN-41 Gene-Modification Injection",
        factions: [FactionNames.Silhouette],
        basePrice: 190e6,
        preRequisites: [],
        requiredReputation: 2.5e4,
        effects: "+15 cha skill, +15 cha exp",
        tags: ["cha", "skill", "exp"]
    },
    {
        name: "The Black Hand",
        factions: [FactionNames.TheBlackHand],
        basePrice: 550e6,
        preRequisites: [],
        requiredReputation: 100_000,
        effects: "+10 hack skill, +15 str skill, +15 dex skill, +2 hgw, +10 hack power",
        tags: ["hgw", "hack", "skill", "str", "dex", "combat"]
    },
    {
        name: "Wired Reflexes",
        factions: [
            FactionNames.TianDiHui,
            FactionNames.SlumSnakes,
            FactionNames.Sector12,
            FactionNames.Volhaven,
            FactionNames.Aevum,
            FactionNames.Ishima,
            FactionNames.TheSyndicate,
            FactionNames.TheDarkArmy,
            FactionNames.SpeakersForTheDead,
        ],
        basePrice: 2.5e6,
        preRequisites: [],
        requiredReputation: 1250,
        effects: "+5 dex skill, +5 agi skill",
        tags: ["combat", "dex", "agi", "skill"]
    },

// Bladeburner Augmentations
    // EsperEyewear,
    // EMS4Recombination,
    // OrionShoulder,
    // HyperionV1,
    // HyperionV2,
    // GolemSerum,
    // VangelisVirus,
    // VangelisVirus3,
    // INTERLINKED,
    // BladeRunner,
    // BladeArmor,
    // BladeArmorPowerCells,
    // BladeArmorEnergyShielding,
    // BladeArmorUnibeam,
    // BladeArmorOmnibeam,
    // BladeArmorIPU,
    // BladesSimulacrum,
]

// for(let i = 0; i <= 255; i++) {
//     Augmentations["NeuroFluxGovernorLevel"+(i+1)] = {
//         name: "NeuroFlux Governor - Level " + (i+1),
//         factions: ["Sector-12"],
//         basePrice: 750e3 * 1.14 ** i,
//         preRequisites: i > 0 ? [Augmentations["NeuroFluxGovernorLevel"+(i)]]:[],
//         requiredReputation: 500e3,
//         effects: "+1 to most multipliers",
//         tags: ["combat", "dex", "agi", "str", "def", "skill", "hack", "exp", "cha", "other"]
//     }
// }