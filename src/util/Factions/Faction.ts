export type FactionName =
    | "Illuminati"
    | "Daedalus"
    | "The Covenant"
    | "ECorp"
    | "MegaCorp"
    | "Bachman & Associates"
    | "Blade Industries"
    | "NWO"
    | "Clarke Incorporated"
    | "OmniTek Incorporated"
    | "Four Sigma"
    | "KuaiGong International"
    | "Fulcrum Secret Technologies"
    | "BitRunners"
    | "The Black Hand"
    | "NiteSec"
    | "Aevum"
    | "Chongqing"
    | "Ishima"
    | "New Tokyo"
    | "Sector-12"
    | "Volhaven"
    | "Speakers for the Dead"
    | "The Dark Army"
    | "The Syndicate"
    | "Silhouette"
    | "Tetrads"
    | "Slum Snakes"
    | "Netburners"
    | "Tian Di Hui"
    | "CyberSec"
    | "Bladeburners"
    | "Church of the Machine God"
    | "Shadows of Anarchy"

export type FactionType =
    | "Corporation"
    | "Hacking"
    | "City"
    | "Criminal"
    | "Endgame"
    | "Special"

type FactionRequirement = {
    money?: number,
    location?: string | string[],
    augments?: number,
    hacking?: number,
    agi?: number,
    str?: number,
    dex?: number,
    def?: number,
    company?: {
        name: string,
        reputation: number,
    }
    backdoorOn?: string,
    killed?: number,
    karma?: number,
    notCIAorNSA?: boolean,
    isChief?: boolean,
    infiltrated?: boolean,
    hacknetLevelSum?: number,
    hacknetRamSum?: number,
    hacknetCoreSum?: number,
}

export class Faction {
    constructor(
        public readonly name: FactionName,
        public readonly type: FactionType,
        public readonly requirements: FactionRequirement,
        public readonly enemies: FactionName[] = [],
    ) {
    }
}

export const factions = [
    new Faction(
        "Illuminati",
        "Endgame",
        {
            augments: 30,
            money: 150e9,
            hacking: 1500,
            agi: 1200,
            str: 1200,
            dex: 1200,
            def: 1200,
        }
    ),
    new Faction(
        "Daedalus",
        "Endgame",
        {}
    ),
    new Faction(
        "The Covenant",
        "Endgame",
        {}
    ),
    new Faction(
        "ECorp",
        "Corporation",
        {
            company: {
                name: "ECorp",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "MegaCorp",
        "Corporation",
        {
            company: {
                name: "MegaCorp",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "Bachman & Associates",
        "Corporation",
        {
            company: {
                name: "Bachman & Associates",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "Blade Industries",
        "Corporation",
        {
            company: {
                name: "Blade Industries",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "NWO",
        "Corporation",
        {
            company: {
                name: "NWO",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "Clarke Incorporated",
        "Corporation",
        {
            company: {
                name: "Clarke Incorporated",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "OmniTek Incorporated",
        "Corporation",
        {
            company: {
                name: "OmniTek Incorporated",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "Four Sigma",
        "Corporation",
        {
            company: {
                name: "Four Sigma",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "KuaiGong International",
        "Corporation",
        {
            company: {
                name: "KuaiGong International",
                reputation: 800e3,
            }
        }
    ),
    new Faction(
        "Fulcrum Secret Technologies",
        "Corporation",
        {
            company: {
                name: "Fulcrum Secret Technologies",
                reputation: 800e3,
            },
            backdoorOn: "fulcrumassets",
        }
    ),
    new Faction(
        "BitRunners",
        "Hacking",
        {
            backdoorOn: "run4theh111z",
        }
    ),
    new Faction(
        "The Black Hand",
        "Hacking",
        {
            backdoorOn: "I.I.I.I",
        }
    ),
    new Faction(
        "NiteSec",
        "Hacking",
        {
            backdoorOn: "avmnite-02h",
        }
    ),
    new Faction(
        "Aevum",
        "City",
        {
            money: 40e6,
            location: "Aevum"
        },
        ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]
    ),
    new Faction(
        "Chongqing",
        "City",
        {
            money: 20e6,
            location: "Chongqing"
        },
        ["Sector-12", "Aevum", "Volhaven"]
    ),
    new Faction(
        "Ishima",
        "City",
        {
            money: 30e6,
            location: "Ishima"
        },
        ["Sector-12", "Aevum", "Volhaven"]
    ),
    new Faction(
        "New Tokyo",
        "City",
        {
            money: 20e6,
            location: "New Tokyo"
        },
        ["Sector-12", "Aevum", "Volhaven"]
    ),
    new Faction(
        "Sector-12",
        "City",
        {
            money: 15e6,
            location: "Sector-12"
        },
        ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]
    ),
    new Faction(
        "Volhaven",
        "City",
        {
            money: 50e6,
            location: "Volhaven"
        },
        ["Sector-12", "Aevum", "Chongqing", "New Tokyo", "Ishima"]
    ),
    new Faction(
        "Speakers for the Dead",
        "Criminal",
        {
            hacking: 100,
            def: 300,
            agi: 300,
            str: 300,
            dex: 300,
            killed: 30,
            karma: -45,
            notCIAorNSA: true,
        }
    ),
    new Faction(
        "The Dark Army",
        "Criminal",
        {
            hacking: 300,
            def: 300,
            agi: 300,
            str: 300,
            dex: 300,
            killed: 5,
            karma: -45,
            notCIAorNSA: true,
            location: "Chongqing"
        }
    ),
    new Faction(
        "The Syndicate",
        "Criminal",
        {
            hacking: 200,
            def: 200,
            agi: 200,
            str: 200,
            dex: 200,
            karma: -90,
            notCIAorNSA: true,
            location: ["Aevum", "Sector-12"]
        }
    ),
    new Faction(
        "Silhouette",
        "Criminal",
        {
            money: 15e6,
            isChief: true,
            karma: -22,
        }
    ),
    new Faction(
        "Tetrads",
        "Criminal",
        {
            def: 75,
            agi: 75,
            str: 75,
            dex: 75,
            karma: -18,
            location: ["Chongqing", "New Tokyo", "Ishima"],
        }
    ),
    new Faction(
        "Slum Snakes",
        "Criminal",
        {
            money: 1e6,
            def: 30,
            agi: 30,
            str: 30,
            dex: 30,
            karma: -9,
        }
    ),
    new Faction(
        "Netburners",
        "Special",
        {
            hacking: 80,
            hacknetLevelSum: 100,
            hacknetRamSum: 8,
            hacknetCoreSum: 4,
        }
    ),
    new Faction(
        "Tian Di Hui",
        "City",
        {
            money: 1e6,
            hacking: 50,
            location: ["Chongqing", "New Tokyo", "Ishima"]
        }
    ),
    new Faction(
        "CyberSec",
        "Hacking",
        {
            backdoorOn: "CSEC",
        }
    ),
    // new Faction(
    //     "Bladeburners",
    //     "Special",
    //     {}
    // ),
    // new Faction(
    //     "Church of the Machine God",
    //     "Special",
    //     {}
    // ),
    new Faction(
        "Shadows of Anarchy",
        "Special",
        {
            infiltrated: true
        }
    ),
]