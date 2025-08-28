/*
 * script.js
 *
 * This file implements the core logic for the dress up game. It uses
 * the embedded manifest in index.html to populate dropdown menus and
 * update the stacked preview when selections change. The trait ordering
 * is controlled by the TRAIT_ORDER constant.
 *
 * To update the trait lists, run: python3 update_manifest.py
 */

// Define the layering order from bottom to top. This will be automatically
// updated by the update_manifest.py script to include all detected folders.
const TRAIT_ORDER = ["Skin", "Spine", "Clothes", "Mouth", "Tusk", "Eyes", "Headwear"];

// Global variable to store the trait mapping
let traitMapping = {};

/**
 * Initialize the trait mapping with embedded data
 */
function loadTraitMapping() {
  // Trait mapping data - auto-generated from CSV
  traitMapping = {
  "APE Cosmic Cheetah Fur": {
    "original": "Cheetah",
    "type": "Skin"
  },
  "APE Royal Blossom": {
    "original": "Magnolia",
    "type": "Skin"
  },
  "APE Lunar Crystaline": {
    "original": "White",
    "type": "Skin"
  },
  "APE Default": {
    "original": "Brown",
    "type": "Skin"
  },
  "APE Chromatic Armor": {
    "original": "Rainbow",
    "type": "Skin"
  },
  "APE Oblivion Fossil Hide": {
    "original": "Cream",
    "type": "Skin"
  },
  "APE Abyssal Glow": {
    "original": "Ocean",
    "type": "Skin"
  },
  "APE Enchanted Onyx": {
    "original": "Bronze",
    "type": "Skin"
  },
  "APE Obsidian Flame": {
    "original": "Black",
    "type": "Skin"
  },
  "APE Starlit Frost": {
    "original": "Silver",
    "type": "Skin"
  },
  "APE Dragon's Blood": {
    "original": "Red",
    "type": "Skin"
  },
  "APE Ancient Amber": {
    "original": "Dark Brown",
    "type": "Skin"
  },
  "APE Celestial Alchemy": {
    "original": "Gold",
    "type": "Skin"
  },
  "APE Sapphire Frost": {
    "original": "Blue",
    "type": "Skin"
  },
  "APE Phoenix Feathers": {
    "original": "Orange",
    "type": "Skin"
  },
  "APE Quantum Circuitry": {
    "original": "Robot",
    "type": "Skin"
  },
  "APE Interstellar Aurora": {
    "original": "Alien",
    "type": "Skin"
  },
  "APE Psychedelic Spectrum": {
    "original": "DMT",
    "type": "Skin"
  },
  "APE Tropical Mirage": {
    "original": "Baynana",
    "type": "Skin"
  },
  "APE Grey Marble": {
    "original": "Grey",
    "type": "Skin"
  },
  "APE Necromancer's Veil": {
    "original": "Zombie",
    "type": "Skin"
  },
  "APE Digital Mirage": {
    "original": "Noise",
    "type": "Skin"
  },
  "APE Celestial Prism": {
    "original": "Diamond",
    "type": "Skin"
  },
  "APE Jungle Sovereign": {
    "original": "Admiral",
    "type": "Clothes"
  },
  "APE Apelink": {
    "original": "Apelink",
    "type": "Clothes"
  },
  "APE Elite Stealth": {
    "original": "Army",
    "type": "Clothes"
  },
  "APE Red Toddler": {
    "original": "Baby",
    "type": "Clothes"
  },
  "APE Desert Raider": {
    "original": "Bandolier",
    "type": "Clothes"
  },
  "APE Tropical Rebel": {
    "original": "Baynana",
    "type": "Clothes"
  },
  "APE Baynana Avenger": {
    "original": "Baynanaman",
    "type": "Clothes"
  },
  "APE Streetwise Swagger": {
    "original": "Baysed",
    "type": "Clothes"
  },
  "APE Outlaw Overlord": {
    "original": "Biker",
    "type": "Clothes"
  },
  "APE Blank": {
    "original": "Blank",
    "type": "Headwear"
  },
  "APE Shaman's Heirloom": {
    "original": "Bone Necklace",
    "type": "Clothes"
  },
  "APE Tribal Warrior": {
    "original": "Caveman",
    "type": "Clothes"
  },
  "APE Outlaw Elite": {
    "original": "Cowboy",
    "type": "Clothes"
  },
  "APE Gothic Bride": {
    "original": "Dress",
    "type": "Clothes"
  },
  "APE Warrior of the Fields": {
    "original": "Farmer",
    "type": "Clothes"
  },
  "APE Abyssal Harpooner": {
    "original": "Fisherman",
    "type": "Clothes"
  },
  "APE Sovereign's Amulet": {
    "original": "Glory",
    "type": "Clothes"
  },
  "APE Rainforest Mosaic": {
    "original": "Hawaiian",
    "type": "Clothes"
  },
  "APE Cypherlord": {
    "original": "Hip-Hop Hoodie",
    "type": "Clothes"
  },
  "APE Warrior's Tunic": {
    "original": "Indian",
    "type": "Clothes"
  },
  "APE Oni Kimono": {
    "original": "Kimono",
    "type": "Clothes"
  },
  "APE Sovereign's Mantle": {
    "original": "King's Robe",
    "type": "Clothes"
  },
  "APE Apocalyptic Warrior": {
    "original": "Leather Jacket",
    "type": "Clothes"
  },
  "APE Forester's Guard": {
    "original": "Lumberjack",
    "type": "Clothes"
  },
  "APE Diner's Champion": {
    "original": "McPolo",
    "type": "Clothes"
  },
  "APE Shadow Artist": {
    "original": "Mime",
    "type": "Clothes"
  },
  "APE Crypt Guardian": {
    "original": "Mummy",
    "type": "Clothes"
  },
  "APE Dread Captain's Regalia": {
    "original": "Pirate",
    "type": "Clothes"
  },
  "APE Riot Commander": {
    "original": "Police",
    "type": "Clothes"
  },
  "APE Escape Artist's Mark": {
    "original": "Prison",
    "type": "Clothes"
  },
  "APE Speculator's Shackle": {
    "original": "Restrain",
    "type": "Clothes"
  },
  "APE Predator's Prize": {
    "original": "Ripped Tee",
    "type": "Clothes"
  },
  "APE Warlord's Robe": {
    "original": "Robe",
    "type": "Clothes"
  },
  "APE Forest Sovereign": {
    "original": "Robin",
    "type": "Clothes"
  },
  "APE Admiral of the Abyss": {
    "original": "Sailor",
    "type": "Clothes"
  },
  "APE Cosmic Conqueror": {
    "original": "Spacesuit",
    "type": "Clothes"
  },
  "APE Stormbringer Jersey": {
    "original": "Striped Tee",
    "type": "Clothes"
  },
  "APE Tropical Overlord Straps": {
    "original": "Suspenders",
    "type": "Clothes"
  },
  "APE Dark Warrior's Cuirass": {
    "original": "Tanktop",
    "type": "Clothes"
  },
  "APE Nebula Core Tee": {
    "original": "Tie Dye",
    "type": "Clothes"
  },
  "APE Warlock's Shroud": {
    "original": "Toga",
    "type": "Clothes"
  },
  "APE Night Operative's Gear": {
    "original": "Tracksuit",
    "type": "Clothes"
  },
  "APE Abyssal Illusion Tee": {
    "original": "Trippy",
    "type": "Clothes"
  },
  "APE Shadow Weaver's Neckpiece": {
    "original": "Turtleneck",
    "type": "Clothes"
  },
  "APE Midnight Regalia": {
    "original": "Tuxedo",
    "type": "Clothes"
  },
  "APE Boardhide Gear": {
    "original": "Tweed",
    "type": "Clothes"
  },
  "APE Warlord's Fur Mantle": {
    "original": "Viking",
    "type": "Clothes"
  },
  "APE XRP Cryptowear Hoodie": {
    "original": "XRP Hoodie",
    "type": "Clothes"
  },
  "APE Angry": {
    "original": "Angry",
    "type": "Eyes"
  },
  "APE Bite Lips": {
    "original": "Bite Lips",
    "type": "Mouth"
  },
  "APE Bite Teeth": {
    "original": "Bite Teeth",
    "type": "Mouth"
  },
  "APE Thorn-Infused Jungle Gum": {
    "original": "Bubble",
    "type": "Mouth"
  },
  "APE Cyber Furnace-Cigar": {
    "original": "Cigar",
    "type": "Mouth"
  },
  "APE Nuclear Nogie": {
    "original": "Cigarette",
    "type": "Mouth"
  },
  "APE Pandemonium Pact Coin": {
    "original": "Coin",
    "type": "Mouth"
  },
  "APE Shard Blade": {
    "original": "Dagger",
    "type": "Mouth"
  },
  "APE Abyssal Shine Grill": {
    "original": "Diamond Grill",
    "type": "Mouth"
  },
  "APE Ravaged Donut": {
    "original": "Donut",
    "type": "Mouth"
  },
  "APE Sovereign Fang Grill": {
    "original": "Gold Grill",
    "type": "Mouth"
  },
  "APE Happy": {
    "original": "Happy",
    "type": "Eyes"
  },
  "APE Inferno Hotdog": {
    "original": "Hotdog",
    "type": "Mouth"
  },
  "APE Bite-Sec Ledger": {
    "original": "Ledger",
    "type": "Mouth"
  },
  "APE Prismatic Bite": {
    "original": "Multicolor Grill",
    "type": "Mouth"
  },
  "APE No Expression": {
    "original": "No Expression",
    "type": "Mouth"
  },
  "APE Normal": {
    "original": "Normal",
    "type": "Eyes"
  },
  "APE Mischief's Binky": {
    "original": "Pacifier",
    "type": "Mouth"
  },
  "APE Raucous Reveler": {
    "original": "Party Horn",
    "type": "Mouth"
  },
  "APE Piano Grill": {
    "original": "Piano Grill",
    "type": "Mouth"
  },
  "APE Baynana Puff": {
    "original": "Pipe",
    "type": "Mouth"
  },
  "APE Apocalyptic Slice": {
    "original": "Pizza",
    "type": "Mouth"
  },
  "APE Rainbow Spheres": {
    "original": "Rainbow",
    "type": "Mouth"
  },
  "APE Thorned Rose": {
    "original": "Rose",
    "type": "Mouth"
  },
  "APE Bronzed Decay Bite": {
    "original": "Rotten Grill",
    "type": "Mouth"
  },
  "APE S": {
    "original": "S",
    "type": "Mouth"
  },
  "APE Sad": {
    "original": "Sad",
    "type": "Eyes"
  },
  "APE Smug": {
    "original": "Smug",
    "type": "Mouth"
  },
  "APE Zipper Maw": {
    "original": "Stitch",
    "type": "Mouth"
  },
  "APE Tongue": {
    "original": "Tongue",
    "type": "Mouth"
  },
  "APE Timber Fang Grill": {
    "original": "Wooden Grill",
    "type": "Mouth"
  },
  "APE Yawn": {
    "original": "Yawn",
    "type": "Mouth"
  },
  "APE Yelling": {
    "original": "Yelling",
    "type": "Mouth"
  },
  "APE Dimensional Spectra Frames": {
    "original": "3D",
    "type": "Eyes"
  },
  "APE Retro Neon Eclipse": {
    "original": "70s",
    "type": "Eyes"
  },
  "APE Arrogant": {
    "original": "Arrogant",
    "type": "Eyes"
  },
  "APE Mystic Veil Vision": {
    "original": "Blindfold",
    "type": "Eyes"
  },
  "APE Cooling Fury Lazers": {
    "original": "Blue Lazer",
    "type": "Eyes"
  },
  "APE Closed Eyes": {
    "original": "Closed Eyes",
    "type": "Eyes"
  },
  "APE Brokenana Coins": {
    "original": "Coins",
    "type": "Eyes"
  },
  "APE Cyberpunk Visors": {
    "original": "Cyber Shades",
    "type": "Eyes"
  },
  "APE Dominition Warfare": {
    "original": "Cyborg",
    "type": "Eyes"
  },
  "APE Battle-Scarred Tactical Eyepatch": {
    "original": "Eyepatch",
    "type": "Eyes"
  },
  "APE Inferno Heart Eyes": {
    "original": "Heart",
    "type": "Eyes"
  },
  "APE Broken Optic Glasses": {
    "original": "Optic Glasses",
    "type": "Eyes"
  },
  "APE Red Lazer": {
    "original": "Red Lazer",
    "type": "Eyes"
  },
  "APE Scar": {
    "original": "Scar",
    "type": "Eyes"
  },
  "APE Scared": {
    "original": "Scared",
    "type": "Eyes"
  },
  "APE Shocked": {
    "original": "Shocked",
    "type": "Eyes"
  },
  "APE Crimson Razor Shutters": {
    "original": "Shutter",
    "type": "Eyes"
  },
  "APE Shy": {
    "original": "Shy",
    "type": "Eyes"
  },
  "APE Stoned": {
    "original": "Stoned",
    "type": "Eyes"
  },
  "APE Tattoo": {
    "original": "Tattoo",
    "type": "Eyes"
  },
  "APE Thinking": {
    "original": "Thinking",
    "type": "Eyes"
  },
  "APE X": {
    "original": "X-Eyes",
    "type": "Eyes"
  },
  "APE Zombie": {
    "original": "Zombie",
    "type": "Eyes"
  },
  "APE Warlord's Combat Helmet": {
    "original": "Army Helmet",
    "type": "Headwear"
  },
  "APE Azure Crest Cap": {
    "original": "Backward Cap",
    "type": "Headwear"
  },
  "APE Toxic Spiked Peel": {
    "original": "Banana Peel",
    "type": "Headwear"
  },
  "APE Rugged Jungle Bandana": {
    "original": "Bandana",
    "type": "Headwear"
  },
  "APE Darkforce Beanie": {
    "original": "Beanie",
    "type": "Headwear"
  },
  "APE Shadow XRP Overcap": {
    "original": "Beanie Cap",
    "type": "Headwear"
  },
  "APE Warrior's Shadow Beret": {
    "original": "Beret",
    "type": "Headwear"
  },
  "APE Storm Surge Bucker Hat": {
    "original": "Bucket Hat",
    "type": "Headwear"
  },
  "APE Night Prowler Ears": {
    "original": "Bunny Ears",
    "type": "Headwear"
  },
  "APE Culinary Warlord's Hat": {
    "original": "Chef Hat",
    "type": "Headwear"
  },
  "APE Cowboy Shadow Hat": {
    "original": "Cowboy",
    "type": "Headwear"
  },
  "APE Sovereign's Dark Coronet": {
    "original": "Crown",
    "type": "Headwear"
  },
  "APE Spirit Band": {
    "original": "Feather Headband",
    "type": "Headwear"
  },
  "APE Shadowed Jungle Fez": {
    "original": "Fez",
    "type": "Headwear"
  },
  "APE Abyssal Street Cap": {
    "original": "Flat Cap",
    "type": "Headwear"
  },
  "APE Inferno Mystic Cap": {
    "original": "Gnome Hat",
    "type": "Headwear"
  },
  "APE Eclipse Aurora Ring": {
    "original": "Halo",
    "type": "Headwear"
  },
  "APE Crimson Warrior Headband": {
    "original": "Headband",
    "type": "Headwear"
  },
  "APE Inferno Wrath Horns": {
    "original": "Horns",
    "type": "Headwear"
  },
  "APE Dark Harlequin Hat": {
    "original": "Jester",
    "type": "Headwear"
  },
  "APE Thorned Victory Halo": {
    "original": "Laurel",
    "type": "Headwear"
  },
  "APE Diner's Champion Cap": {
    "original": "McCap",
    "type": "Headwear"
  },
  "APE Razor Crest Mohawk": {
    "original": "Mohawk",
    "type": "Headwear"
  },
  "APE Spiked Hat Crown": {
    "original": "P Hat",
    "type": "Headwear"
  },
  "APE Cursed Origami Hat": {
    "original": "Paper Hat",
    "type": "Headwear"
  },
  "APE Twilight Carnival Cap": {
    "original": "Party Hat",
    "type": "Headwear"
  },
  "APE Crimson Fury Mane": {
    "original": "Pink Hair",
    "type": "Headwear"
  },
  "APE Dread Corsair": {
    "original": "Pirate",
    "type": "Headwear"
  },
  "APE Enforcer's Shadow Cap": {
    "original": "Police Cap",
    "type": "Headwear"
  },
  "APE Blazed Hair": {
    "original": "Red Hair",
    "type": "Headwear"
  },
  "APE Bladed Spinner Cap": {
    "original": "Red Ripple Cap",
    "type": "Headwear"
  },
  "APE Forest Rogue Cap": {
    "original": "Robin",
    "type": "Headwear"
  },
  "APE Subdued Sea Cap": {
    "original": "Sailor",
    "type": "Headwear"
  },
  "APE Jungle Shade Sombrero": {
    "original": "Sombrero",
    "type": "Headwear"
  },
  "APE Rotor Jungle Cap": {
    "original": "Spinner",
    "type": "Headwear"
  },
  "APE Superman": {
    "original": "Superman",
    "type": "Headwear"
  },
  "APE Thorned Shadow Hat": {
    "original": "Tinfoil",
    "type": "Headwear"
  },
  "APE Crimson Claw Topper": {
    "original": "Top Hat",
    "type": "Headwear"
  },
  "APE Monsoon Shadow Protector": {
    "original": "Umbrella Hat",
    "type": "Headwear"
  },
  "APE Jungle Warrior Cap": {
    "original": "Viking",
    "type": "Headwear"
  },
  "APE Jungle Shade Visor": {
    "original": "Visor",
    "type": "Headwear"
  },
  "APE Feral Cap": {
    "original": "Wizard Hat",
    "type": "Headwear"
  },
  "APE Cryptic Jungle X-Cap": {
    "original": "XRP Cap",
    "type": "Headwear"
  },
  "HOG Abyssal Viper Snakes": {
    "original": "Snake",
    "type": "Skin"
  },
  "HOG Eclipse Orb Canvas": {
    "original": "Panda",
    "type": "Skin"
  },
  "HOG Verdant Flux Dermis": {
    "original": "Slimey",
    "type": "Skin"
  },
  "HOG Lava ": {
    "original": "Lava",
    "type": "Skin"
  },
  "HOG Normal": {
    "original": "Normal",
    "type": "Skin"
  },
  "HOG Onyxhide Stripes": {
    "original": "Zebra",
    "type": "Skin"
  },
  "HOG Shadowhide Giraffe": {
    "original": "Giraffe",
    "type": "Skin"
  },
  "HOG Titanhide": {
    "original": "Rhino",
    "type": "Skin"
  },
  "HOG Fire from Apes": {
    "original": "Black",
    "type": "Skin"
  },
  "HOG Shadowstrike Commando": {
    "original": "Camo",
    "type": "Skin"
  },
  "HOG Obsidianfin Tigershadow": {
    "original": "Tigershark",
    "type": "Skin"
  },
  "HOG Cybershadow ": {
    "original": "Cyborg",
    "type": "Skin"
  },
  "HOG Junglesworn Scar": {
    "original": "Orange",
    "type": "Skin"
  },
  "HOG Abyssal Diamondglow": {
    "original": "Diamond",
    "type": "Skin"
  },
  "HOG Frostshadow Leopard": {
    "original": "Snowleopard",
    "type": "Skin"
  },
  "HOG Luminarctic Frostweave": {
    "original": "White",
    "type": "Skin"
  },
  "HOG Duskfang Bovine Hide": {
    "original": "Cow",
    "type": "Skin"
  },
  "HOG Gilded Fang Hide": {
    "original": "Gold",
    "type": "Skin"
  },
  "HOG Burned Bacon": {
    "original": "Bacon",
    "type": "Skin"
  },
  "HOG Blightrose Hide": {
    "original": "Pink",
    "type": "Skin"
  },
  "HOG Obsidian Azure Spikes": {
    "original": "Blue",
    "type": "Skin"
  },
  "HOG Rotvenom Husk": {
    "original": "Zombie",
    "type": "Skin"
  },
  "HOG Stonehide Primalgarb": {
    "original": "Caveman",
    "type": "Clothing"
  },
  "HOG Crimson Shadowweave": {
    "original": "Polo",
    "type": "Clothing"
  },
  "HOG Infernal Decathlete Jersey": {
    "original": "Basketball Shirt",
    "type": "Clothing"
  },
  "HOG None": {
    "original": "None",
    "type": "Headwear"
  },
  "HOG Cryptoshade XRP Hoodie": {
    "original": "XRP Sweater",
    "type": "Clothing"
  },
  "HOG Obsidiansteel Shadowplate": {
    "original": "Futuristic",
    "type": "Clothing"
  },
  "HOG Eldritch Slime Patches": {
    "original": "Mud spots",
    "type": "Clothing"
  },
  "HOG Twin Seraph Chains": {
    "original": "Necklace",
    "type": "Clothing"
  },
  "HOG Denim Shadowweave Shirt": {
    "original": "Jeans Shirt",
    "type": "Clothing"
  },
  "HOG Emberstrapped Penitence Attire": {
    "original": "Prison",
    "type": "Clothing"
  },
  "HOG Shadowline Veilshirt": {
    "original": "Striped",
    "type": "Clothing"
  },
  "HOG Nordic Valorweave Attire": {
    "original": "Viking",
    "type": "Clothing"
  },
  "HOG Regal Blushgown": {
    "original": "Princess Dress",
    "type": "Clothing"
  },
  "HOG Syndicate Suit": {
    "original": "Mob suit",
    "type": "Clothing"
  },
  "HOG Shadowgrill Uniform": {
    "original": "Mc Polo",
    "type": "Clothing"
  },
  "HOG ": {
    "original": "Hoodie",
    "type": "Clothing"
  },
  "HOG Training": {
    "original": "Training Suit",
    "type": "Clothing"
  },
  "HOG Jungle Baynana Tee": {
    "original": "T Shirt",
    "type": "Clothing"
  },
  "HOG Shadowcat Obsidian Robe": {
    "original": "Leopard Bathrobe",
    "type": "Clothing"
  },
  "HOG Heroic Hog Ensemble": {
    "original": "Suoerhog",
    "type": "Clothing"
  },
  "HOG Arctic Essence Sleeveless Tunic": {
    "original": "Wife Beater",
    "type": "Clothing"
  },
  "HOG Armory Harness": {
    "original": "Ammo",
    "type": "Clothing"
  },
  "HOG Harvest Horizon Ensemble": {
    "original": "Farmer",
    "type": "Clothing"
  },
  "HOG Midnight Maverick Shirt": {
    "original": "Cowboy Shirt",
    "type": "Clothing"
  },
  "HOG Feral Mark T-Shirt": {
    "original": "Ripped",
    "type": "Clothing"
  },
  "HOG Shadowsteel Knight Hauberk": {
    "original": "Knight",
    "type": "Clothing"
  },
  "HOG Midnight Rebel Biker Vest": {
    "original": "Biker Vest",
    "type": "Clothing"
  },
  "HOG Nexus Cyborg Armor": {
    "original": "Robot",
    "type": "Clothing"
  },
  "HOG Shadow Monk": {
    "original": "Monk",
    "type": "Clothing"
  },
  "HOG Obsidian Shadow Jacket": {
    "original": "Leather Jacket",
    "type": "Clothing"
  },
  "HOG Sleek Suspenders": {
    "original": "Suspender",
    "type": "Clothing"
  },
  "HOG Solar Tropic Thunder Shirt": {
    "original": "Hawaiian Shirt",
    "type": "Clothing"
  },
  "HOG Shadow Buccaneer Vest": {
    "original": "Pirate",
    "type": "Clothing"
  },
  "HOG Nebula Vanguard": {
    "original": "Space",
    "type": "Clothing"
  },
  "HOG Crimson Timberjack Flannel": {
    "original": "Lumberjack",
    "type": "Clothing"
  },
  "HOG Shadow XRP Vanguard Tee": {
    "original": "XRP Shirt",
    "type": "Clothing"
  },
  "HOG Scarlet Sentinel": {
    "original": "Jacket",
    "type": "Clothing"
  },
  "HOG Obsidian Ronin Armor": {
    "original": "Samurai 2",
    "type": "Clothing"
  },
  "HOG Jungle Vigilante": {
    "original": "Police",
    "type": "Clothing"
  },
  "HOG Abyssal Relic Shroud": {
    "original": "Mummy",
    "type": "Clothing"
  },
  "HOG Nirvana Embrace": {
    "original": "Nirvana",
    "type": "Clothing"
  },
  "HOG Shadowguard Futuraarmor": {
    "original": "Futuristic 2",
    "type": "Clothing"
  },
  "HOG Shadow Ronin Vanguard": {
    "original": "Samurai",
    "type": "Clothing"
  },
  "HOG Shadow Striped": {
    "original": "Prison 2",
    "type": "Clothing"
  },
  "HOG Regal Crimson Mantle": {
    "original": "King",
    "type": "Clothing"
  },
  "HOG Shadow Legion Command Regalia": {
    "original": "Army General",
    "type": "Clothing"
  },
  "HOG Obsidian Laboratory Vestments": {
    "original": "Labcoat",
    "type": "Clothing"
  },
  "HOG Tired H": {
    "original": "Tired",
    "type": "Eyes"
  },
  "HOG Blue eye": {
    "original": "Blue eye",
    "type": "Eyes"
  },
  "HOG Normal H": {
    "original": "Normal",
    "type": "Tusk"
  },
  "HOG Open H": {
    "original": "Open",
    "type": "Eyes"
  },
  "HOG Stellar Star Gaze Spectacles": {
    "original": "Round Glasses",
    "type": "Eyes"
  },
  "HOG Celestial Starlight Shades": {
    "original": "Star Glasses",
    "type": "Eyes"
  },
  "HOG Prism Vision Spectacles": {
    "original": "3D Glasses",
    "type": "Eyes"
  },
  "HOG Happy H": {
    "original": "Happy",
    "type": "Eyes"
  },
  "HOG Scar H": {
    "original": "Scar",
    "type": "Eyes"
  },
  "HOG Orange": {
    "original": "Orange",
    "type": "Eyes"
  },
  "HOG Mutated Omelette": {
    "original": "Egg",
    "type": "Eyes"
  },
  "HOG Piercing": {
    "original": "Pierceing",
    "type": "Eyes"
  },
  "HOG Voidcurse Raider Patch": {
    "original": "Pirate Patch",
    "type": "Eyes"
  },
  "HOG Cyber Eclipse Optic": {
    "original": "Cyborg",
    "type": "Eyes"
  },
  "HOG Nebula Gazer Monocle": {
    "original": "Monocle",
    "type": "Eyes"
  },
  "HOG Shy H": {
    "original": "Shy",
    "type": "Eyes"
  },
  "HOG Zombie": {
    "original": "Zombie",
    "type": "Mouth"
  },
  "HOG Duskraven Sentinel": {
    "original": "Bird",
    "type": "Eyes"
  },
  "HOG Coins H": {
    "original": "Coins",
    "type": "Eyes"
  },
  "HOG Veil of Ashrift": {
    "original": "Highwayman Mask",
    "type": "Eyes"
  },
  "HOG XX H": {
    "original": "XX",
    "type": "Eyes"
  },
  "HOG Shocked ": {
    "original": "3D Eyes",
    "type": "Eyes"
  },
  "HOG High H": {
    "original": "High",
    "type": "Eyes"
  },
  "HOG Venomshade": {
    "original": "Green",
    "type": "Eyes"
  },
  "HOG Bloodthorn": {
    "original": "Heart",
    "type": "Eyes"
  },
  "HOG Void Spiral Lenses": {
    "original": "Hypno",
    "type": "Eyes"
  },
  "HOG Sleepy H": {
    "original": "Sleepy",
    "type": "Eyes"
  },
  "HOG Voidstrike Shades": {
    "original": "Harley",
    "type": "Eyes"
  },
  "HOG Eclipse Vision": {
    "original": "Future",
    "type": "Eyes"
  },
  "HOG Red laser H": {
    "original": "Red laser",
    "type": "Eyes"
  },
  "HOG Thug Shadow": {
    "original": "Thuglife",
    "type": "Eyes"
  },
  "HOG Blue Laser H": {
    "original": "Blue laser",
    "type": "Eyes"
  },
  "HOG Backwards Bloodshade Raider Cap": {
    "original": "Backwards Cap",
    "type": "Headwear"
  },
  "HOG Duskrider Woven Hat 2": {
    "original": "Strawhat 2",
    "type": "Headwear"
  },
  "HOG Sunrift Warhelm": {
    "original": "Viking",
    "type": "Headwear"
  },
  "HOG Obsidian Fang War Hat": {
    "original": "Chinese Hat",
    "type": "Headwear"
  },
  "HOG Shadowcrest Nest": {
    "original": "Bird",
    "type": "Tusk"
  },
  "HOG Dreadwave Resonators": {
    "original": "Retro Headphones",
    "type": "Headwear"
  },
  "HOG Halo": {
    "original": "Halo",
    "type": "Headwear"
  },
  "HOG Bloodshade Raider Cap": {
    "original": "Baseball Cap",
    "type": "Headwear"
  },
  "HOG Warlord's Beret": {
    "original": "Army Beret",
    "type": "Headwear"
  },
  "HOG Furychimp Hood": {
    "original": "Monkey hat",
    "type": "Headwear"
  },
  "HOG Stormborne Rotor Cap": {
    "original": "Propeller",
    "type": "Headwear"
  },
  "HOG Void Corsair Tricorn": {
    "original": "Pirate",
    "type": "Headwear"
  },
  "HOG Duskrider Sombrero": {
    "original": "Sombrero",
    "type": "Headwear"
  },
  "HOG Duskrider Headwrap": {
    "original": "Bandana",
    "type": "Headwear"
  },
  "HOG Zombie": {
    "original": "McHog",
    "type": "Headwear"
  },
  "HOG Inferno Fang Mohawk": {
    "original": "Mohawk",
    "type": "Headwear"
  },
  "HOG Warborn Crest Helm": {
    "original": "Knight Helmet",
    "type": "Headwear"
  },
  "HOG Ironwind Aviator Cap": {
    "original": "Helmet",
    "type": "Headwear"
  },
  "HOG Duskrider Woven Hat": {
    "original": "Straw hat",
    "type": "Headwear"
  },
  "HOG Bloodcrest XRP Cap": {
    "original": "XRP Hat",
    "type": "Headwear"
  },
  "HOG Phantom Striker Headband": {
    "original": "Samurai",
    "type": "Headwear"
  },
  "HOG Frostborne Hat": {
    "original": "Russian Hat",
    "type": "Headwear"
  },
  "HOG Dustspire Cap": {
    "original": "Flat Cap",
    "type": "Headwear"
  },
  "HOG Toxic Drip Reactor Cap": {
    "original": "Drinking Cap",
    "type": "Headwear"
  },
  "HOG Obsidian Hex Topper": {
    "original": "Tophat",
    "type": "Headwear"
  },
  "HOG Ashfang Headdress": {
    "original": "Chief",
    "type": "Headwear"
  },
  "HOG Thornforged Crown": {
    "original": "Crown",
    "type": "Headwear"
  },
  "HOG Baynana Huskhelm": {
    "original": "Banana",
    "type": "Headwear"
  },
  "HOG Toxveil Turban": {
    "original": "Indian Hat",
    "type": "Headwear"
  },
  "HOG Ashrack Antlers": {
    "original": "Antler",
    "type": "Headwear"
  },
  "HOG Hog Enforcer Cap?": {
    "original": "Police",
    "type": "Headwear"
  },
  "HOG Shadowspire Beret": {
    "original": "Beret",
    "type": "Headwear"
  },
  "HOG Gravelight Optics": {
    "original": "Nightvision",
    "type": "Headwear"
  },
  "HOG Close": {
    "original": "Closed",
    "type": "Mouth"
  },
  "HOG Infernapep Slice": {
    "original": "Pizza",
    "type": "Mouth"
  },
  "HOG Angry": {
    "original": "Angry",
    "type": "Mouth"
  },
  "HOG Blazestick": {
    "original": "Dynamite",
    "type": "Mouth"
  },
  "HOG Sad": {
    "original": "Sad",
    "type": "Mouth"
  },
  "HOG Grin": {
    "original": "Grin",
    "type": "Mouth"
  },
  "HOG Rotten": {
    "original": "Rotten",
    "type": "Mouth"
  },
  "HOG Stitch": {
    "original": "Stitch",
    "type": "Mouth"
  },
  "HOG Emberfang Dagger": {
    "original": "Dagger",
    "type": "Mouth"
  },
  "HOG Smofang Emberroll": {
    "original": "Big Cigarette",
    "type": "Mouth"
  },
  "HOG Blightwrap Cinderroll": {
    "original": "Cigar",
    "type": "Mouth"
  },
  "HOG Venomlick Shardpop": {
    "original": "Lolly",
    "type": "Mouth"
  },
  "HOG Feralbane Husk": {
    "original": "Banana",
    "type": "Mouth"
  },
  "HOG Prismfang Grille": {
    "original": "Rainbow Teeth",
    "type": "Mouth"
  },
  "HOG Molten Maw": {
    "original": "Gold Teeth",
    "type": "Mouth"
  },
  "HOG Long Beard": {
    "original": "Long Beard",
    "type": "Mouth"
  },
  "HOG Sunfang Pipe": {
    "original": "Gold Pipe",
    "type": "Mouth"
  },
  "HOG Shardsmoke Scepter": {
    "original": "Diamond Pipe",
    "type": "Mouth"
  },
  "HOG Oblivion Rainbow": {
    "original": "Rainbow Doodle",
    "type": "Mouth"
  },
  "HOG Tongue": {
    "original": "Tongue",
    "type": "Mouth"
  },
  "HOG Xumm": {
    "original": "Xumm",
    "type": "Mouth"
  },
  "HOG Ashvein Stick": {
    "original": "Cigarette",
    "type": "Mouth"
  },
  "HOG Shatterbite Grille": {
    "original": "Diamond Teeth",
    "type": "Mouth"
  },
  "HOG Ironbark Tusks": {
    "original": "Wooden Tusk",
    "type": "Tusk"
  },
  "HOG Silver Tusks": {
    "original": "Silver Tusk",
    "type": "Tusk"
  },
  "HOG Sovereign Fang Bone": {
    "original": "Gold",
    "type": "Tusk"
  },
  "HOG Broken Bone": {
    "original": "Broken",
    "type": "Tusk"
  },
  "HOG Verdigris Fang": {
    "original": "Bronze Tusk",
    "type": "Tusk"
  },
  "HOG Spineforge Tusks": {
    "original": "Iron",
    "type": "Tusk"
  },
  "HOG Songbird Fangs": {
    "original": "Songbird Color",
    "type": "Tusk"
  },
  "HOG Cybernetic Tusks": {
    "original": "Tech Tusk",
    "type": "Tusk"
  },
  "HOG Goreglop Tusks": {
    "original": "Slimey",
    "type": "Tusk"
  },
  "HOG Moltusk Fangs": {
    "original": "Lava",
    "type": "Tusk"
  },
  "HOG Blightfang Katana": {
    "original": "Samurai Sword",
    "type": "Tusk"
  },
  "HOG Rotfang Husk": {
    "original": "Banana",
    "type": "Tusk"
  },
  "HOG Bloodstripe Fang": {
    "original": "Candy",
    "type": "Tusk"
  },
  "HOG Abyssal Shine Bone": {
    "original": "Diamond Tusk",
    "type": "Tusk"
  }
};
  
  console.log('Loaded embedded trait mapping with', Object.keys(traitMapping).length, 'entries');
}



/**
 * Get the original trait name for a given new trait name
 */
function getOriginalTraitName(newTraitName) {
  // Remove .png extension if present
  const cleanName = newTraitName.replace(/\.png$/i, '');
  
  if (traitMapping[cleanName]) {
    return traitMapping[cleanName].original;
  }
  
  // If not found, return the new name
  return cleanName;
}

/**
 * Create a DOM element with given tag, properties and children.
 * Simple helper to reduce repetition when building the UI.
 *
 * @param {string} tag   The HTML tag to create
 * @param {Object} props Key/value pairs to assign as properties/attributes
 * @param {Array<Node>} children Child nodes to append
 * @returns {HTMLElement} The created element
 */
function createElement(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([key, val]) => {
    if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), val);
    } else if (key === 'className') {
      el.className = val;
    } else if (key in el) {
      el[key] = val;
    } else {
      el.setAttribute(key, val);
    }
  });
  children.forEach(child => el.appendChild(child));
  return el;
}

/**
 * Get the trait manifest from the embedded data
 * @returns {Object} The trait manifest object
 */
function getTraitManifest() {
  // This data is automatically updated by update_script_manifest.py
  return {
  "Skin": [
    "APE Abyssal Glow.png",
    "APE Ancient Amber.png",
    "APE Celestial Alchemy.png",
    "APE Celestial Prism.png",
    "APE Chromatic Armor.png",
    "APE Cosmic Cheetah Fur.png",
    "APE Default.png",
    "APE Digital Mirage.png",
    "APE Dragon's Blood.png",
    "APE Enchanted Onyx.png",
    "APE Grey Marble.png",
    "APE Interstellar Aurora.png",
    "APE Lunar Crystaline.png",
    "APE Necromancer's Veil.png",
    "APE Oblivion Fossil Hide.png",
    "APE Obsidian Flame.png",
    "APE Phoenix Feathers.png",
    "APE Psychedelic Spectrum.png",
    "APE Quantum Circuitry.png",
    "APE Royal Blossom.png",
    "APE Sapphire Frost.png",
    "APE Starlit Frost.png",
    "APE Tropical Mirage.png",
    "HOG Abyssal Viper Scales.png",
    "HOG Azure Spikes.png",
    "HOG Blightrose Hide.png",
    "HOG Burned Bacon.png",
    "HOG Cybershadow.png",
    "HOG Eclipse Orb Canvas.png",
    "HOG Frostshadow Leopard.png",
    "HOG Gilded Fang Hide.png",
    "HOG Jungleworn Scar.png",
    "HOG Lava.png",
    "HOG Luminarctic Frostweave.png",
    "HOG Obsidian Tigershadow.png",
    "HOG Onyxhide Stripes.png",
    "HOG Rotvenom Husk.png",
    "HOG Shadowhide Giraffe.png",
    "HOG Shadowstrike Commando.png",
    "HOG TBD.png",
    "HOG Titanhide.png",
    "HOG Verdant Flux Dermis.png"
  ],
  "Spine": [
    "HOG Feral Filigree.png",
    "HOG Shadow Spines.png",
    "HOG Starborn Shards.png"
  ],
  "Clothes": [
    "APE Abyssal Harpooner.png",
    "APE Abyssal Illusion Tee.png",
    "APE Apelink.png",
    "APE Apocalyptic Warrior.png",
    "APE Baynana Avenger.png",
    "APE Boardhide Gear.png",
    "APE Cypherlord.png",
    "APE Desert Raider.png",
    "APE Elite Stealth.png",
    "APE Forest Sovereign.png",
    "APE Forester's Guard.png",
    "APE Gothic Bride.png",
    "APE Jungle Sovereign.png",
    "APE Midnight Regalia.png",
    "APE Night Operative's Gear.png",
    "APE None.png",
    "APE Oni Kimono.png",
    "APE Outlaw Elite.png",
    "APE Outlaw Overlord.png",
    "APE Predator s Prize.png",
    "APE Rainforest Mosaic.png",
    "APE Red Toddler.png",
    "APE Sailor.png",
    "APE Shadow Weaver's Neckpiece.png",
    "APE Shaman's Heirloom.png",
    "APE Sovereign's Amulet.png",
    "APE Sovereign's Mantle.png",
    "APE Stormbringer Jersey.png",
    "APE Streetwise Swagger.png",
    "APE Tanktop Dark Warrior s Cuirass.png",
    "APE Tribal Warrior.png",
    "APE Tropical Overlord Straps.png",
    "APE Tropical Rebel.png",
    "APE Warlock's Shroud.png",
    "APE Warlord's Fur Mantle.png",
    "APE Warlord's Robe.png",
    "APE Warrior of the Fields.png",
    "APE Warrior's Tunic.png",
    "APE XRP Cryptowear Hoodie.png",
    "APE Dread Captain's Regalia.png",
    "APE Dark Warrior's Cuirass.png",
    "APE Riot Commander.png",
    "APE Escape Artist's Mark.png",
    "APE Speculator's Shackle.png",
    "APE Crypt Guardian.png",
    "APE Diner's Champion.png",
    "APE Shadow Artist.png",
    "HOG Abyssal Relic Shroud.png",
    "HOG Arctic Essence Sleeveless Tunic.png",
    "HOG Armory Harness.png",
    "HOG Army General.png",
    "HOG Crimson Shadowweave.png",
    "HOG Crimson Timberjack Flannel.png",
    "HOG Cryptoshade XRP Hoodie.png",
    "HOG Denim Shadowweave Shirt.png",
    "HOG Emberstrapped Penitence Attire.png",
    "HOG Feral Mark T-Shirt.png",
    "HOG FUTURISTIC.png",
    "HOG Harvest Horizon Ensemble.png",
    "HOG Heroic Hog Ensemble.png",
    "HOG HOODIE.png",
    "HOG Infernal Decathlete Jersey.png",
    "HOG Jungle Baynana Tee.png",
    "HOG Jungle Vigilante.png",
    "HOG Midnight Maverick Shirt.png",
    "HOG Midnight Rebel Biker Vest.png",
    "HOG Nebula Vanguard.png",
    "HOG Nexus Cyborg Armor.png",
    "HOG NIrvana Embrace.png",
    "HOG None.png",
    "HOG Nordic Valorweave Attire.png",
    "HOG Obsidian Laboratory Vestments.png",
    "HOG Obsidian Shadow Jacket.png",
    "HOG POLO.png",
    "HOG Regal Blushgown.png",
    "HOG Regal Crimson Mantle.png",
    "HOG SAMURAI 2.png",
    "HOG SAMURAI.png",
    "HOG Scarlet Sentinel 2.png",
    "HOG Scarlet Sentinel.png",
    "HOG Shadow Buccaneer Vest.png",
    "HOG Shadow Monk.png",
    "HOG Shadow Striped.png",
    "HOG Shadow XRP Vanguard Tee.png",
    "HOG Shadowcat Obsidian Robe.png",
    "HOG Shadowguard Futuraarmor.png",
    "HOG Shadowsteel Knight Hauberk.png",
    "HOG Shoulder Strap.png",
    "HOG Solar Tropic Thunder Shirt.png",
    "HOG Stonehide Primalgarb.png",
    "HOG Striped Shadowline Veilshirt.png",
    "HOG Syndicate Suit.png",
    "HOG Twin Seraph Chains.png"
  ],
  "Mouth": [
    "APE Abyssal Shine Grill.png",
    "APE Angry.png",
    "APE Apocalyptic Slice.png",
    "APE Baynana Puff.png",
    "APE Bite Lips.png",
    "APE Bite Teeth.png",
    "APE Bite-Sec Ledger.png",
    "APE Bronzed Decay Bite.png",
    "APE Cyber Furnace-Cigar.png",
    "APE Happy.png",
    "APE Inferno Hot Dog.png",
    "APE Mischief's Binky.png",
    "APE No Expression.png",
    "APE Normal.png",
    "APE Nuclear Stogie.png",
    "APE Pandemonium Pact Coin.png",
    "APE Piano Grill.png",
    "APE Prism Jaw.png",
    "APE Prismatic Bite.png",
    "APE Raucous Reveler.png",
    "APE Sad.png",
    "APE Shard Blade.png",
    "APE Smug.png",
    "APE Sovereign Fang Grill.png",
    "APE Standard.png",
    "APE Thorned Rose.png",
    "APE Timber Fang Grill.png",
    "APE Tongue.png",
    "APE Yawn.png",
    "APE Yelling.png",
    "APE Zipper Maw.png",
    "HOG angry.png",
    "HOG Close.png",
    "HOG Grin.png",
    "HOG Long Beard.png",
    "HOG Rainbow Puke.png",
    "HOG Rotten.png",
    "HOG Sad.png",
    "HOG Stitch.png",
    "HOG Tongue.png",
    "HOG Xumm.png",
    "HOG Zombie.png"
  ],
  "Eyes": [
    "APE Angry.png",
    "APE Arrogant.png",
    "APE Battle-Scarred Tactical Eyepatch.png",
    "APE Broken Optic Glasses.png",
    "APE Brokenana Coins.png",
    "APE Closed Eyes.png",
    "APE Cooling Fury Lazers.png",
    "APE Cyberpunk Visors.png",
    "APE Dimensional Spectra Frames.png",
    "APE Eyes.png",
    "APE Happy.png",
    "APE Inferno Heart Eyes.png",
    "APE Mystic Veil Vision.png",
    "APE Normal.png",
    "APE Red Lazer.png",
    "APE Retro Neon Eclipse.png",
    "APE Sad.png",
    "APE Scar.png",
    "APE Scared.png",
    "APE Shocked.png",
    "APE Shutter.png",
    "APE Shy.png",
    "APE Stoned.png",
    "APE Tattoo.png",
    "APE Thinking.png",
    "APE X.png",
    "APE Zombie.png",
    "HOG Bird Duskraven Sentinel.png",
    "HOG Bloodthorn.png",
    "HOG Blue Eye.png",
    "HOG Blue Laser H.png",
    "HOG Celestial Starlight Shades.png",
    "HOG Coins H.png",
    "HOG Cyber Eclipse Optic.png",
    "HOG Eclipse Vision.png",
    "HOG Gold Laser.png",
    "HOG Green Laser.png",
    "HOG High H.png",
    "HOG Nebula Gazer Monocle.png",
    "HOG Normal H.png",
    "HOG Open H.png",
    "HOG Orange.png",
    "HOG Prism Vision Spectacles.png",
    "HOG Red Laser H.png",
    "HOG Scar H.png",
    "HOG Shocked.png",
    "HOG Shy H.png",
    "HOG Sleepy H.png",
    "HOG Stellar Star Gaze Spectacles.png",
    "HOG Thug Shadow.png",
    "HOG Tired H.png",
    "HOG Venomshade.png",
    "HOG Void Spiral Lenses.png",
    "HOG Voidcurse Raider Patch.png",
    "HOG Voidstrike Shades.png",
    "HOG XX H.png",
    "HOG Zombie H.png"
  ],
  "Headwear": [
    "APE Abyssal Street Cap.png",
    "APE Azure Crest Cap.png",
    "APE Bladed Spinner Cap.png",
    "APE Blazed Hair.png",
    "APE Cowboy Shadow Hat.png",
    "APE Crimson Claw Topper.png",
    "APE Crimson Fury Mane.png",
    "APE Crimson Warrior Headband.png",
    "APE Cryptic Jungle X-Cap.png",
    "APE Culinary Warlord's Hat.png",
    "APE Cursed Origami Hat.png",
    "APE Dark Harlequin Hat.png",
    "APE Darkforce Beanie.png",
    "APE Diner's Champion Cap.png",
    "APE Dread Corsair.png",
    "APE Eclipse Aurora Ring.png",
    "APE Enforcer's Shadow Cap.png",
    "APE Feral Cap.png",
    "APE Forest Rogue Cap.png",
    "APE Inferno Mystic Cap.png",
    "APE Inferno Wrath Horns.png",
    "APE Jungle Shade Sombrero.png",
    "APE Jungle Shade Visor.png",
    "APE Jungle Warrior Cap.png",
    "APE Monsoon Shadow Protector.png",
    "APE Night Prowler Ears.png",
    "APE None.png",
    "APE Razor Crest Mohawk.png",
    "APE Rotor Jungle Cap.png",
    "APE Rugged Jungle Bandana.png",
    "APE Shadow XRP Overcap.png",
    "APE Shadowed Jungle Fez.png",
    "APE Sovereign's Dark Coronet.png",
    "APE Spiked Hat Crown.png",
    "APE Spirit Band.png",
    "APE Storm Surge Bucker Hat.png",
    "APE Subdued Sea Cap.png",
    "APE Superman.png",
    "APE Thorned Shadow Hat.png",
    "APE Thorned Victory Halo.png",
    "APE Toxic Spiked Peel.png",
    "APE Twilight Carnival Cap.png",
    "APE Warlord's Combat Helmet.png",
    "APE Warrior's Shadow Beret.png",
    "HOG Ashfang Headdress.png",
    "HOG Ashrack Antlers.png",
    "HOG Aviation Cap.png",
    "HOG Backwards Cap.png",
    "HOG Baynana Huskhelm.png",
    "HOG Bloodcrest XRP Cap.png",
    "HOG Bloodshade Raider Cap.png",
    "HOG Chinese Hat.png",
    "HOG Dreadwave Resonators.png",
    "HOG Dustspire Cap.png",
    "HOG Duskrider Headwrap.png",
    "HOG Duskrider Sombrero.png",
    "HOG Duskrider Woven Hat.png",
    "HOG Enforcer Cap.png",
    "HOG Frostborne Hat.png",
    "HOG Furychimp Hood.png",
    "HOG Gravelight Optics.png",
    "HOG Halo.png",
    "HOG Inferno Fang Mohawk.png",
    "HOG Irongrill Hat.png",
    "HOG None.png",
    "HOG Obsidian Hex Topper.png",
    "HOG Phantom Marauder Mask.png",
    "HOG Phantom Striker Headband.png",
    "HOG Piercing.png",
    "HOG Shadowcrest Nest.png",
    "HOG Stormborne Rotor Cap.png",
    "HOG Sunrift Warhelm.png",
    "HOG Thornforged Crown.png",
    "HOG Toxic Drip Reactor Cap.png",
    "HOG Toxveil Turban.png",
    "HOG Void Corsair Tricorn.png",
    "HOG Warborn Crest Helm.png",
    "HOG Warlord's Beret.png"
  ],
  "Tusk": [
    "HOG Abyssal Shine Bone.png",
    "HOG Blightfang Katana.png",
    "HOG Bloodstripe Fang.png",
    "HOG Broken Bone.png",
    "HOG Cybernetic Tusks.png",
    "HOG Goreglop Tusks.png",
    "HOG Ironbark Tusks.png",
    "HOG Moonshard Tusks.png",
    "HOG Moltusk Fangs.png",
    "HOG Rotfang Husk.png",
    "HOG Shadowcrest Nest.png",
    "HOG Songbird Fangs.png",
    "HOG Sovereign Fang Bone.png",
    "HOG Spineforge Tusks.png",
    "HOG Verdigris Fang.png"
  ]
  };
}





/**
 * Build the controls and preview area based on the manifest.
 *
 * @param {Object} manifest Mapping of trait names to arrays of filenames
 */
function buildUI(manifest) {
  const controlsContainer = document.getElementById('controls');
  const preview = document.getElementById('preview');

  // Ensure the preview element exists
  if (!preview) {
    console.error('Preview element not found');
    return;
  }

  // Use the defined TRAIT_ORDER for proper layering, but filter to only include
  // traits that exist in the manifest
  const traitOrder = TRAIT_ORDER.filter(trait => manifest.hasOwnProperty(trait));
  console.log('Building UI with trait order:', traitOrder);

  // Create an image layer for each trait in order.  We'll assign
  // z‑indexes based on order so that later traits appear on top.
  traitOrder.forEach((trait, index) => {
    const img = createElement('img', {
      id: `layer-${trait}`,
      alt: trait,
      style: `z-index: ${index}; display: none;` // hide until loaded
    });
    preview.appendChild(img);
  });

  // Build control groups for each trait
  traitOrder.forEach(trait => {
    const options = manifest[trait] || [];
    const selectEl = createElement('select', {
      id: `select-${trait}`,
      onChange: (e) => updateTrait(trait, e.target.value)
    },
    // children: Option elements for each file; first option is placeholder
    [
      ...options.map(filename => {
        const label = filename.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
        return createElement('option', { value: filename }, [document.createTextNode(label)]);
      })
    ]);
    
    // Create label for the select
    const labelEl = createElement('label', { htmlFor: `select-${trait}` }, [
      document.createTextNode(trait.charAt(0).toUpperCase() + trait.slice(1))
    ]);
    
    // Create original trait name display
    const originalNameEl = createElement('div', { 
      id: `original-${trait}`,
      className: 'original-trait-name',
      style: 'font-size: 0.8em; color: #666; margin-top: 2px; font-style: italic; text-align: center;'
    }, [document.createTextNode('')]);
    
    // Wrap them in a div
    const group = createElement('div', { className: 'control-group' }, [labelEl, selectEl, originalNameEl]);
    controlsContainer.appendChild(group);
    
    // Initialize the selection to the first option, if available
    if (options.length > 0) {
      updateTrait(trait, options[0]);
    }
  });
}

/**
 * Update the preview for a single trait when the selection changes.
 *
 * @param {string} trait   The name of the trait layer
 * @param {string} filename The filename selected from the dropdown
 */
function updateTrait(trait, filename) {
  const img = document.getElementById(`layer-${trait}`);
  if (!img) return;
  if (!filename) {
    img.style.display = 'none';
    img.src = '';
    return;
  }
  img.src = `https://baysed.b-cdn.net/traits/${trait}/${filename}`;
  img.style.display = 'block';
  
  // Update the original trait name display
  const originalNameEl = document.getElementById(`original-${trait}`);
  if (originalNameEl) {
    const originalName = getOriginalTraitName(filename);
    originalNameEl.textContent = originalName;
  }
}

/**
 * Generate a random trait set by randomly selecting one trait from each category.
 */
function randomizeTraits() {
  // Get the current manifest data from the dropdowns
  const manifest = {};
  
  // Get all trait types from the existing select elements
  const traitTypes = [];
  const controlsContainer = document.getElementById('controls');
  if (controlsContainer) {
    const selectElements = controlsContainer.querySelectorAll('select[id^="select-"]');
    selectElements.forEach(select => {
      const traitType = select.id.replace('select-', '');
      traitTypes.push(traitType);
    });
  }
  
  traitTypes.forEach(trait => {
    const selectEl = document.getElementById(`select-${trait}`);
    if (selectEl) {
      const options = Array.from(selectEl.options).map(option => option.value);
      manifest[trait] = options.filter(option => option); // Filter out empty values
    }
  });
  
  // For each trait category, randomly select one option
  traitTypes.forEach(trait => {
    const options = manifest[trait] || [];
    if (options.length > 0) {
      // Select a random trait from the available options
      const randomIndex = Math.floor(Math.random() * options.length);
      const randomTrait = options[randomIndex];
      
      // Update the dropdown selection
      const selectEl = document.getElementById(`select-${trait}`);
      if (selectEl) {
        selectEl.value = randomTrait;
      }
      
      // Update the preview
      updateTrait(trait, randomTrait);
    }
  });
}

/**
 * Load the trait manifest and build the UI.
 */
async function init() {
  console.log('Initializing application...');
  try {
    // Load the trait mapping first
    console.log('About to load trait mapping...');
    loadTraitMapping();
    console.log('Trait mapping loaded, proceeding with manifest...');
    
    // Get the trait manifest from embedded data
    const manifest = getTraitManifest();
    console.log('Got manifest:', manifest ? 'yes' : 'no');
    
    if (manifest && Object.keys(manifest).length > 0) {
      console.log('Using trait manifest with keys:', Object.keys(manifest));
      buildUI(manifest);
    } else {
      console.error('No trait manifest available');
      throw new Error('No trait manifest available');
    }
    
  } catch (error) {
    console.error('Error in init:', error);
    alert('Could not load trait manifest. Please run: python3 update_script_manifest.py');
  }
}

// When the document is ready, initialise the application
document.addEventListener('DOMContentLoaded', async () => {
  await init();
  
  // Add event listener for the randomize button
  const randomizeBtn = document.getElementById('randomize-btn');
  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', randomizeTraits);
  }
});