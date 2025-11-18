/*
 * script-ape-only.js
 *
 * Simplified version for testing ape trait URL linking only.
 * Uses the new CDN directory structure: ravager_traits_1024/ape/{trait_type}/{filename}.png
 */

// Define the layering order from bottom to top
const TRAIT_ORDER = ["Skin", "Spine", "Clothes", "Mouth", "Tusk", "Eyes", "Headwear"];

// Global variables
let traitManifest = null;
const SPECIES = "ape"; // Fixed to ape only
const CDN_BASE = "https://baysed.b-cdn.net/ravager_traits_1024";

/**
 * Create a DOM element with given tag, properties and children.
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
 * Load the trait manifest from the JSON file
 */
async function loadTraitManifest() {
  try {
    const response = await fetch('detailed_trait_manifest.json');
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.statusText}`);
    }
    const fullManifest = await response.json();
    
    // Extract only ape data
    traitManifest = {
      ape: fullManifest.ape || {},
      shared: fullManifest.shared || {}
    };
    
    console.log('Loaded ape trait manifest:', traitManifest);
    return traitManifest;
  } catch (error) {
    console.error('Error loading trait manifest:', error);
    throw error;
  }
}

/**
 * Get available options for a trait type
 */
function getTraitOptions(traitType) {
  if (!traitManifest || !traitManifest.ape || !traitManifest.ape[traitType]) {
    // Check shared traits for Clothes
    if (traitType === 'Clothes' && traitManifest.shared && traitManifest.shared.Clothes) {
      return traitManifest.shared.Clothes;
    }
    return [];
  }

  const traitData = traitManifest.ape[traitType];
  
  // Ape traits are simple arrays
  if (Array.isArray(traitData)) {
    return traitData;
  }
  
  return [];
}

/**
 * Build the image URL for a trait
 */
function buildTraitUrl(traitType, filename) {
  if (!filename || filename === 'None' || filename === '') {
    return null;
  }
  
  // Ape URL structure: ravager_traits_1024/ape/{trait_type}/{filename}
  return `${CDN_BASE}/${SPECIES}/${traitType}/${filename}`;
}

/**
 * Update the preview for a single trait when the selection changes.
 */
function updateTrait(traitType, filename) {
  const img = document.getElementById(`layer-${traitType}`);
  if (!img) return;
  
  if (!filename || filename === 'None' || filename === '') {
    img.style.display = 'none';
    img.src = '';
    return;
  }

  const url = buildTraitUrl(traitType, filename);
  console.log(`Updating ${traitType}: ${filename} -> ${url}`);
  
  img.src = url;
  img.style.display = 'block';
}

/**
 * Build the UI controls
 */
function buildUI() {
  const controlsContainer = document.getElementById('controls');
  const preview = document.getElementById('preview');
  
  // Clear existing controls
  controlsContainer.innerHTML = '';
  preview.innerHTML = '';
  
  if (!traitManifest || !traitManifest.ape) {
    console.error('No manifest data for apes');
    return;
  }
  
  // Filter trait order to only include traits that exist
  const traitOrder = TRAIT_ORDER.filter(trait => {
    // Check if trait exists in ape data
    if (traitManifest.ape[trait]) return true;
    // Check shared traits for Clothes
    if (trait === 'Clothes' && traitManifest.shared && traitManifest.shared.Clothes) return true;
    return false;
  });
  
  console.log('Building UI for apes with traits:', traitOrder);
  
  // Create image layers for each trait
  traitOrder.forEach((trait, index) => {
    const img = createElement('img', {
      id: `layer-${trait}`,
      alt: trait,
      style: `z-index: ${index}; display: none;`
    });
    preview.appendChild(img);
  });
  
  // Build control groups for each trait
  traitOrder.forEach(trait => {
    const options = getTraitOptions(trait);
    
    if (options.length === 0) return;
    
    const selectEl = createElement('select', {
      id: `select-${trait}`,
      onChange: (e) => {
        const filename = e.target.value;
        updateTrait(trait, filename);
        console.log(`Selected ${trait}: ${filename}`);
      }
    });
    
    // Add placeholder option
    const placeholder = createElement('option', { value: '' }, [document.createTextNode('Select ' + trait)]);
    selectEl.appendChild(placeholder);
    
    // Add options
    options.forEach(filename => {
      const label = filename.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
      const option = createElement('option', { value: filename }, [document.createTextNode(label)]);
      selectEl.appendChild(option);
    });
    
    const labelEl = createElement('label', { htmlFor: `select-${trait}` }, [
      document.createTextNode(trait.charAt(0).toUpperCase() + trait.slice(1))
    ]);
    
    const group = createElement('div', { className: 'control-group' }, [labelEl, selectEl]);
    controlsContainer.appendChild(group);
  });
  
  // Initialize with first option for Skin
  const skinSelect = document.getElementById('select-Skin');
  if (skinSelect && skinSelect.options.length > 1) {
    skinSelect.value = skinSelect.options[1].value;
    updateTrait('Skin', skinSelect.value);
  }
}

/**
 * Generate a random trait set
 */
function randomizeTraits() {
  const controlsContainer = document.getElementById('controls');
  const selectElements = controlsContainer.querySelectorAll('select[id^="select-"]');
  
  selectElements.forEach(select => {
    const traitType = select.id.replace('select-', '');
    const options = Array.from(select.options)
      .map(opt => opt.value)
      .filter(val => val !== ''); // Exclude placeholder
    
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      const randomValue = options[randomIndex];
      select.value = randomValue;
      updateTrait(traitType, randomValue);
    }
  });
}

/**
 * Initialize the application
 */
async function init() {
  console.log('Initializing ape-only trait tester...');
  
  try {
    // Load the trait manifest
    await loadTraitManifest();
    
    // Build the UI
    buildUI();
    
    // Set up randomize button
    const randomizeBtn = document.getElementById('randomize-btn');
    if (randomizeBtn) {
      randomizeBtn.addEventListener('click', randomizeTraits);
    }
    
    console.log('Application initialized');
  } catch (error) {
    console.error('Error initializing application:', error);
    alert('Failed to load trait manifest. Please check that detailed_trait_manifest.json exists.');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

