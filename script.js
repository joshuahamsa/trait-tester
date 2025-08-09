/*
 * script.js
 *
 * This file implements the core logic for the dress up game.  It
 * automatically scans the traits folders to build the manifest,
 * populates drop‑down menus for each trait layer, and updates the
 * stacked preview when selections change.  The trait ordering is
 * controlled by the TRAIT_ORDER constant.
 */

// Define the layering order from bottom to top.  Feel free to adjust
// this array if you change the order of your trait directories.
const TRAIT_ORDER = ["skin", "clothes", "mouth", "eyes", "headwear"];

// Path to the manifest JSON file.  The manifest should be an object
// with keys for each trait folder and values that are arrays of
// filename strings (without path).
const MANIFEST_PATH = 'traits/manifest.json';

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
 * Scan a trait folder to find all PNG files
 * @param {string} traitType - The trait type (e.g., 'skin', 'clothes')
 * @returns {Promise<Array<string>>} Array of PNG filenames
 */
async function scanTraitFolder(traitType) {
  try {
    // Try to fetch the directory listing first (works on some servers)
    const response = await fetch(`traits/${traitType}/`);
    if (response.ok) {
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find all links that end with .png
      const links = Array.from(doc.querySelectorAll('a[href$=".png"]'));
      const filenames = links.map(link => link.href.split('/').pop());
      
      const pngFiles = filenames.filter(filename => filename.endsWith('.png')).sort();
      if (pngFiles.length > 0) {
        console.log(`Successfully scanned ${traitType} folder:`, pngFiles);
        return pngFiles;
      }
    }
  } catch (error) {
    console.warn(`Directory listing failed for ${traitType}, trying file detection...`);
  }
  
  // Fallback: try to detect files by testing common names
  return detectFilesByTesting(traitType);
}

/**
 * Fallback method to detect files by testing for common filenames
 * @param {string} traitType - The trait type
 * @returns {Promise<Array<string>>} Array of detected PNG filenames
 */
async function detectFilesByTesting(traitType) {
  const commonNames = getCommonNamesForTrait(traitType);
  const detectedFiles = [];
  
  // Test each file by making a HEAD request
  const testPromises = commonNames.map(async (filename) => {
    try {
      const response = await fetch(`traits/${traitType}/${filename}`, { method: 'HEAD' });
      if (response.ok) {
        return filename;
      }
    } catch (error) {
      // File doesn't exist or can't be accessed
    }
    return null;
  });
  
  const results = await Promise.all(testPromises);
  const validFiles = results.filter(file => file !== null).sort();
  
  if (validFiles.length > 0) {
    console.log(`Detected ${validFiles.length} files in ${traitType} via testing:`, validFiles);
  } else {
    console.warn(`No files detected in ${traitType} folder`);
  }
  
  return validFiles;
}

/**
 * Get common filenames for each trait type (fallback data)
 * @param {string} traitType - The trait type
 * @returns {Array<string>} Array of common filenames for this trait type
 */
function getCommonNamesForTrait(traitType) {
  const commonNames = {
    skin: [
      "Default.png", "Abyssal Glow.png", "Ancient Amber.png", "Celestial Alchemy.png",
      "Celestial Prism.png", "Chromatic Armor.png", "Cosmic Cheetah Fur.png",
      "Digital Mirage.png", "Dragon's Blood.png", "Enchanted Onyx.png",
      "Grey Marble.png", "Interstellar Aurora.png", "Lunar Crystaline.png",
      "Necromancer's Veil.png", "Oblivion Fossil Hide.png", "Obsidian Flame.png",
      "Phoenix Feathers.png", "Psychedelic Spectrum.png", "Quantum Circuitry.png",
      "Royal Blossom.png", "Sapphire Frost.png", "Starlit Frost.png", "Tropical Mirage.png"
    ],
    clothes: [
      "Abyssal Harpooner.png", "Abyssal Illusion Tee.png", "Apelink.png",
      "Apocalyptic Warrior.png", "Baynana Avenger.png", "Boardhide Gear.png",
      "Cypherlord.png", "Desert Raider.png", "Elite Stealth.png", "Forest Sovereign.png",
      "Forester's Guard.png", "Gothic Bride.png", "Jungle Sovereign.png", "Midnight Regalia.png",
      "Night Operative's Gear.png", "Oni Kimono.png", "Outlaw Elite.png", "Outlaw Overlord.png",
      "Predator s Prize.png", "Rainforest Mosaic.png", "Red Toddler.png", "Sailor.png",
      "Shadow Weaver's Neckpiece.png", "Shaman's Heirloom.png", "Sovereign's Amulet.png",
      "Sovereign's Mantle.png", "Spacecuit to Cosmic Conqueror.png", "Stormbringer Jersey.png",
      "Streetwise Swagger.png", "Tanktop Dark Warrior s Cuirass.png", "Tie Dye to Nebula Core tee.png",
      "Tribal Warrior.png", "Tropical Overlord Straps.png", "Tropical Rebel.png",
      "Warlock's Shroud.png", "Warlord's Fur Mantle.png", "Warlord's Robe.png",
      "Warrior of the Fields.png", "Warrior's Tunic.png", "XRP Cryptowear Hoodie.png"
    ],
    mouth: [
      "Angry.png", "Happy.png", "Normal.png", "Sad.png", "Smug.png", "Abyssal Shine Grill.png",
      "Apocalyptic Slice.png", "Baynana Puff.png", "Bite Lips.png", "Bite Teeth.png",
      "Bite-Sec Ledger.png", "Bronzed Decay Bite.png", "Cyber Furnace-Cigar.png", "Inferno Hot Dog.png",
      "Mischief's Binky.png", "No Expression.png", "Nuclear Stogie.png", "Pandemonium Pact Coin.png",
      "Piano Grill.png", "Prism Jaw.png", "Prismatic Bite.png", "Raucous Reveler.png",
      "Ravaged Donut.png", "Shard Blade.png", "Sovereign Fang Grill.png", "Standard.png",
      "Thorned Rose.png", "Timber Fang Grill.png", "Tongue.png", "Yawn.png", "Yelling.png", "Zipper Maw.png"
    ],
    eyes: [
      "Angry.png", "Arrogant.png", "Closed Eyes.png", "Eyes.png", "Happy.png", "Normal.png",
      "Sad.png", "Scared.png", "Shocked.png", "Shy.png", "Stoned.png", "Thinking.png",
      "Battle-Scarred Tactical Eyepatch.png", "Broken Optic Glasses.png", "Brokenana Coins.png",
      "Cooling Fury Lazers.png", "Cyberpunk Visors.png", "Dimensional Spectra Frames.png",
      "Inferno Heart Eyes.png", "Mystic Veil Vision.png", "Red Lazer.png", "Retro Neon Eclipse.png",
      "Scar.png", "Shutter.png", "Tattoo.png", "X.png", "Zombie.png"
    ],
    headwear: [
      "Abyssal Street Cap.png", "Azure Crest Cap.png", "Bladed Spinner Cap.png", "Blazed Hair.png",
      "Cowboy Shadow Hat.png", "Crimson Claw Topper.png", "Crimson Fury Mane.png",
      "Crimson Warrior Headband.png", "Cryptic Jungle X-Cap.png", "Culinary Warlord's Hat.png",
      "Cursed Origami Hat.png", "Dark Harlequin Hat.png", "Darkforce Beanie.png",
      "Diner's Champion Cap.png", "Dread Corsair.png", "Eclipse Aurora Ring.png",
      "Enforcer's Shadow Cap.png", "Feral Cap.png", "Forest Rogue Cap.png", "Inferno Mystic Cap.png",
      "Inferno Wrath Horns.png", "Jungle Shade Sombrero.png", "Jungle Shade Visor.png",
      "Jungle Warrior Cap.png", "Monsoon Shadow Protector.png", "Night Prowler Ears.png",
      "Razor Crest Mohawk.png", "Rotor Jungle Cap.png", "Rugged Jungle Bandana.png",
      "Shadow XRP Overcap.png", "Shadowed Jungle Fez.png", "Sovereign's Dark Coronet.png",
      "Spiked Hat Crown.png", "Spirit Band.png", "Storm Surge Bucker Hat.png", "Subdued Sea Cap.png",
      "Superman.png", "Thorned Shadow Hat.png", "Thorned Victory Halo.png", "Toxic Spiked Peel.png",
      "Twilight Carnival Cap.png", "Warlord's Combat Helmet.png", "Warrior's Shadow Beret.png"
    ]
  };
  
  return commonNames[traitType] || [];
}

/**
 * Build manifest by scanning trait folders
 * @returns {Promise<Object>} Manifest object
 */
async function buildManifestFromFolders() {
  const manifest = {};
  
  for (const traitType of TRAIT_ORDER) {
    try {
      const files = await scanTraitFolder(traitType);
      if (files.length > 0) {
        manifest[traitType] = files;
        console.log(`Found ${files.length} files in ${traitType}:`, files);
      } else {
        console.warn(`No files found in ${traitType} folder`);
        manifest[traitType] = [];
      }
    } catch (error) {
      console.error(`Error scanning ${traitType} folder:`, error);
      manifest[traitType] = [];
    }
  }
  
  return manifest;
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

  // Create an image layer for each trait in order.  We'll assign
  // z‑indexes based on order so that later traits appear on top.
  TRAIT_ORDER.forEach((trait, index) => {
    const img = createElement('img', {
      id: `layer-${trait}`,
      alt: trait,
      style: `z-index: ${index}; display: none;` // hide until loaded
    });
    preview.appendChild(img);
  });

  // Build control groups for each trait
  TRAIT_ORDER.forEach(trait => {
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
    // Wrap them in a div
    const group = createElement('div', { className: 'control-group' }, [labelEl, selectEl]);
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
  img.src = `traits/${trait}/${filename}`;
  img.style.display = 'block';
}

/**
 * Generate a random trait set by randomly selecting one trait from each category.
 */
function randomizeTraits() {
  // Get the current manifest data from the dropdowns
  const manifest = {};
  
  TRAIT_ORDER.forEach(trait => {
    const selectEl = document.getElementById(`select-${trait}`);
    if (selectEl) {
      const options = Array.from(selectEl.options).map(option => option.value);
      manifest[trait] = options.filter(option => option); // Filter out empty values
    }
  });
  
  // For each trait category, randomly select one option
  TRAIT_ORDER.forEach(trait => {
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
  try {
    // First, try to build manifest by scanning folders
    console.log('Scanning trait folders to build manifest...');
    const manifest = await buildManifestFromFolders();
    
    // Check if we got any data from scanning
    const hasData = Object.values(manifest).some(files => files.length > 0);
    
    if (!hasData) {
      // Fallback to embedded manifest
      const embedded = document.getElementById('trait-manifest');
      if (embedded && embedded.textContent) {
        try {
          const embeddedManifest = JSON.parse(embedded.textContent);
          console.log('Using embedded manifest as fallback');
          buildUI(embeddedManifest);
          return;
        } catch (err) {
          console.error('Failed to parse embedded manifest', err);
        }
      }
      
      // Final fallback: fetch manifest via HTTP
      try {
        const res = await fetch(MANIFEST_PATH);
        if (!res.ok) {
          throw new Error(`Failed to fetch manifest: ${res.status} ${res.statusText}`);
        }
        const fetchedManifest = await res.json();
        console.log('Using fetched manifest as fallback');
        buildUI(fetchedManifest);
        return;
      } catch (err) {
        console.error('Failed to fetch manifest:', err);
      }
    }
    
    // Use the scanned manifest
    console.log('Using scanned manifest:', manifest);
    buildUI(manifest);
    
  } catch (error) {
    console.error('Error in init:', error);
    alert('Could not load trait manifest. Please ensure that trait folders exist and contain PNG files.');
  }
}

// When the document is ready, initialise the application
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Add event listener for the randomize button
  const randomizeBtn = document.getElementById('randomize-btn');
  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', randomizeTraits);
  }
});