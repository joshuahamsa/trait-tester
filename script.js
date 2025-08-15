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
    "APE Spacecuit to Cosmic Conqueror.png",
    "APE Stormbringer Jersey.png",
    "APE Streetwise Swagger.png",
    "APE Tanktop Dark Warrior s Cuirass.png",
    "APE Tie Dye to Nebula Core tee.png",
    "APE Tribal Warrior.png",
    "APE Tropical Overlord Straps.png",
    "APE Tropical Rebel.png",
    "APE Warlock's Shroud.png",
    "APE Warlord's Fur Mantle.png",
    "APE Warlord's Robe.png",
    "APE Warrior of the Fields.png",
    "APE Warrior's Tunic.png",
    "APE XRP Cryptowear Hoodie.png",
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
    "HOG Rotten.png",
    "HOG Sad.png",
    "HOG Stitch.png",
    "Hog Tongue.png",
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
    "HOG Obsidian Hex Topper.png",
    "HOG Phantom Marauder Mask.png",
    "HOG Phantom Striker Headband.png",
    "HOG Piercing.png",
    "HOG Rainbow Puke.png",
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
  img.src = `https://baysed.b-cdn.net/traits/${trait}/${filename}`;
  img.style.display = 'block';
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
function init() {
  console.log('Initializing application...');
  try {
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
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Add event listener for the randomize button
  const randomizeBtn = document.getElementById('randomize-btn');
  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', randomizeTraits);
  }
});