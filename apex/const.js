const itemProbability = {
    1: {
        "Sand": 1.0,
        "Glass": 0.4,
        "Bone Meal": 1.0,
        "Sugar Cane Plant": 0.8,
        "Wood Enchanting Table": 1.0,
        "Iron Ladder": 0.7,
        "Engraved Andesite": 0.9,
        "Stone Slab": 1.0,
        "Gravel": 1.0,
        "Pumpkin Seeds": 0.7,
        "Granite": 0.23,
        "Orange Wool": 0.3,
        "White Carpet": 0.3,
        "Red Carpet": 0.06,
        "Light Gray Carpet": 0.05,
        "Leather Block": 0.3,
        "Apple Block": 0.015,
        "Carrot Seeds": 0.002,
        "Gray Carpet": 0.001
    },
    2: {
        "Sand": 0.65,
        "Glass": 0.6,
        "Bone Meal": 0.65,
        "Sugar Cane Plant": 0.65,
        "Wood Enchanting Table": 0.65,
        "Iron Ladder": 0.65,
        "Engraved Andesite": 0.65,
        "Stone Slab": 0.7,
        "Gravel": 0.7,
        "Pumpkin Seeds": 0.7,
        "Granite": 0.7,
        "Orange Wool": 0.8,
        "White Carpet": 1.0,
        "Red Carpet": 0.8,
        "Light Gray Carpet": 0.8,
        "Leather Block": 0.9,
        "Apple Block": 0.5,
        "Carrot Seeds": 0.4,
        "Gray Carpet": 0.3,
        "Blue Carpet": 0.01,
        "Grant Wool": 0.01,
        "Chili Pepper Block": 0.01
    },
    3: {
        "Sand": 0.2,
        "Glass": 0.3,
        "Bone Meal": 0.1,
        "Sugar Cane Plant": 0.2,
        "Wood Enchanting Table": 0.05,
        "Iron Ladder": 0.08,
        "Stone Slab": 0.01,
        "Gravel": 0.5,
        "Pumpkin Seeds": 0.4,
        "Granite": 0.5,
        "Orange Wool": 0.5,
        "White Carpet": 0.4,
        "Red Carpet": 0.4,
        "Light Gray Carpet": 0.5,
        "Leather Block": 0.8,
        "Apple Block": 0.9,
        "Carrot Seeds": 0.8,
        "Gray Carpet": 1.0,
        "Blue Carpet": 0.7,
        "Grant Wool": 0.6,
        "Chili Pepper Block": 0.8,
        "Purple Carpet": 0.5,
        "Chili Pepper Seeds": 0.15,
        "Block of Lapis Lazuli": 0.2,
        "Beacon": 0.1,
        "Patterned Blue Glass": 0.01,
        "Black Carpet": 0.005
    },
    4: {
        "Sand": 0.01,
        "Glass": 0.01,
        "Bone Meal": 0.01,
        "Sugar Cane Plant": 0.01,
        "Wood Enchanting Table": 0.01,
        "Iron Ladder": 0.01,
        "Engraved Andesite": 0.01,
        "Stone Slab": 0.01,
        "Granite": 0.05,
        "Orange Wool": 0.05,
        "White Carpet": 0.01,
        "Red Carpet": 0.02,
        "Light Gray Carpet": 0.02,
        "Leather Block": 0.02,
        "Apple Block": 0.05,
        "Carrot Seeds": 0.7,
        "Gray Carpet": 0.7,
        "Blue Carpet": 0.1,
        "Grant Wool": 0.7,
        "Chili Pepper Block": 0.8,
        "Purple Carpet": 0.9,
        "Chili Pepper Seeds": 0.9,
        "Block of Lapis Lazuli": 0.9,
        "Beacon": 0.5,
        "Patterned Blue Glass": 0.4,
        "Black Carpet": 0.15,
        "Radar": 0.1,
        "Sponge": 0.01
    },
    5: {
        "Light Gray Carpet": 0.05,
        "Leather Block": 0.05,
        "Apple Block": 0.05,
        "Carrot Seeds": 0.05,
        "Gray Carpet": 0.05,
        "Blue Carpet": 0.1,
        "Grant Wool": 0.07,
        "Chili Pepper Block": 0.1,
        "Purple Carpet": 0.7,
        "Chili Pepper Seeds": 0.6,
        "Block of Lapis Lazuli": 0.9,
        "Beacon": 0.8,
        "Patterned Blue Glass": 0.8,
        "Black Carpet": 0.6,
        "Radar": 0.5,
        "Sponge": 0.4,
        "Emerald Ore": 0.3,
        "Block of Emerald": 0.2,
        "Toxin Ball Block": 0.2,
        "White Chalk": 0.01,
        "Block of Moonstone": 0.005
    }
}
const itemAttributes = {
    "Sand": [
        "Silicon Dust",
        1,
        1
    ],
    "Glass": [
        "Empty Chemical Vial",
        200,
        1
    ],
    "Bone Meal": [
        "Paper",
        10,
        1
    ],
    "Sugar Cane Plant": [
        "Paper Waste",
        11,
        1
    ],
    "Wood Enchanting Table": [
        "Tissue ",
        15,
        1
    ],
    "Iron Ladder": [
        "Steel Rod",
        18,
        1
    ],
    "Engraved Andesite": [
        "Concrete",
        20,
        1
    ],
    "Stone Slab": [
        "Concrete Tile",
        50,
        1
    ],
    "Gravel": [
        "Metal Scrapes",
        100,
        1
    ],
    "Pumpkin Seeds": [
        "Used Battery",
        150,
        1
    ],
    "Granite": [
        "Raw Copper",
        600,
        2
    ],
    "Orange Wool": [
        "Copper Wire",
        700,
        2
    ],
    "White Carpet": [
        "Encrypted Document",
        750,
        2
    ],
    "Red Carpet": [
        "Diplomatic Bag",
        1500,
        2
    ],
    "Light Gray Carpet": [
        "Classified Folder",
        1600,
        2
    ],
    "Leather Block": [
        "Smuggled Textiles",
        1900,
        2
    ],
    "Apple Block": [
        "Medical Supplies",
        3000,
        3
    ],
    "Carrot Seeds": [
        "Microchip",
        3100,
        3
    ],
    "Gray Carpet": [
        "Encrypted Hard Drive",
        3200,
        3
    ],
    "Blue Carpet": [
        "Military Blurprint",
        5000,
        3
    ],
    "Grant Wool": [
        "Stolen Masterpiece ",
        5500,
        3
    ],
    "Chili Pepper Block": [
        "Chemical Crystal ",
        6000,
        3
    ],
    "Purple Carpet": [
        "Experimental Tech",
        8000,
        4
    ],
    "Chili Pepper Seeds": [
        "Lithium Vehicle Battery",
        9000,
        4
    ],
    "Block of Lapis Lazuli": [
        "Server Module",
        10000,
        4
    ],
    "Beacon": [
        "GPS Jammer",
        15000,
        4
    ],
    "Patterned Blue Glass": [
        "AI Memory Crystal",
        20000,
        4
    ],
    "Black Carpet": [
        "Google Server",
        35000,
        5
    ],
    "Radar": [
        "Alien Signal Receiver",
        50000,
        5
    ],
    "Sponge": [
        "Bio-Organic Sample",
        60000,
        5
    ],
    "Emerald Ore": [
        "Uranium-235 Ore",
        80000,
        5
    ],
    "Block of Emerald": [
        "Refined Uranium Core",
        100000,
        5
    ],
    "Toxin Ball Block": [
        "Virus Strain",
        120000,
        5
    ],
    "White Chalk": [
        "Illegal Drug",
        250000,
        5
    ],
    "Block of Moonstone": [
        "Refined Moon-Core",
        500000,
        5
    ]
}