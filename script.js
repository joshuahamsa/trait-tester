/*
 * script.js
 *
 * This file implements the core logic for the trait tester app.
 * It supports both ape and hog species with the new CDN directory structure.
 */

// Define the layering order from bottom to top
const TRAIT_ORDER = ["Skin", "Spine", "Clothes", "Mouth", "Tusk", "Eyes", "Headwear"];

// Global variables
let traitManifest = null;
let currentSpecies = null;
let currentSelections = {}; // Track current selections for nested traits

// CDN base URL
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
    traitManifest = await response.json();
    console.log('Loaded trait manifest:', traitManifest);
    return traitManifest;
  } catch (error) {
    console.error('Error loading trait manifest:', error);
    throw error;
  }
}

/**
 * Check if a trait type has nested structure (for hogs)
 */
function isNestedTrait(species, traitType) {
  if (species !== 'hog') return false;
  const speciesData = traitManifest[species];
  if (!speciesData || !speciesData[traitType]) return false;
  return typeof speciesData[traitType] === 'object' && !Array.isArray(speciesData[traitType]);
}

/**
 * Get available options for a trait type
 */
function getTraitOptions(species, traitType) {
  if (!traitManifest || !traitManifest[species] || !traitManifest[species][traitType]) {
    return [];
  }

  const traitData = traitManifest[species][traitType];
  
  // For nested traits (hog Eyes/Mouth/Tusk), return the keys (types)
  if (isNestedTrait(species, traitType)) {
    // Special handling for Tusk - it depends on Mouth type
    if (traitType === 'Tusk') {
      const mouthSelection = currentSelections['Mouth'];
      if (mouthSelection) {
        // Get the mouth type (remove any skin color part)
        const mouthType = mouthSelection.split('|')[0];
        // If this mouth type exists as a key in Tusk, return its options
        if (traitData[mouthType] && Array.isArray(traitData[mouthType])) {
          return traitData[mouthType];
        }
        // Otherwise, return _direct options
        if (traitData['_direct']) {
          return traitData['_direct'];
        }
      }
      // If no mouth selected, return _direct options
      if (traitData['_direct']) {
        return traitData['_direct'];
      }
      return [];
    }
    // For Eyes and Mouth, return the keys (types), including _direct if it has options
    const keys = Object.keys(traitData);
    // Include _direct only if it has options
    if (traitData['_direct'] && Array.isArray(traitData['_direct']) && traitData['_direct'].length > 0) {
      return keys; // Include _direct
    }
    return keys.filter(key => key !== '_direct');
  }
  
  // For simple traits (arrays), return the array
  if (Array.isArray(traitData)) {
    return traitData;
  }
  
  return [];
}

/**
 * Get the available skin colors for a nested trait type
 */
function getSkinColorsForNestedTrait(species, traitType, typeName) {
  if (!isNestedTrait(species, traitType)) return [];
  
  const traitData = traitManifest[species][traitType];
  if (!traitData[typeName]) return [];
  
  return traitData[typeName];
}

/**
 * Build the image URL for a simple trait (non-nested)
 */
function buildTraitUrl(species, traitType, selection) {
  if (!selection || selection === 'None' || selection === '') {
    return null;
  }
  
  // For simple traits, the selection is the filename
  return `${CDN_BASE}/${species}/${traitType}/${selection}`;
}

/**
 * Update the preview for a single trait when the selection changes.
 */
function updateTrait(traitType, selection) {
  const img = document.getElementById(`layer-${traitType}`);
  if (!img) return;
  
  if (!selection || selection === 'None' || selection === '') {
    img.style.display = 'none';
    img.src = '';
    currentSelections[traitType] = null;
    return;
  }

  // Store the selection
  currentSelections[traitType] = selection;
  
  // For nested traits, we need to get the actual skin color
  if (isNestedTrait(currentSpecies, traitType)) {
    // Special handling for Tusk - it uses mouth type, not its own type
    if (traitType === 'Tusk') {
      const mouthSelection = currentSelections['Mouth'];
      if (!mouthSelection) {
        img.style.display = 'none';
        return;
      }
      
      const mouthType = mouthSelection.split('|')[0];
      // For Tusk, selection is the filename, and we use mouth type as the path component
      const tuskFilename = selection;
      img.src = `${CDN_BASE}/${currentSpecies}/${traitType}/${mouthType}/${tuskFilename}`;
      img.style.display = 'block';
      return;
    }
    
    // For Eyes and Mouth
    // Check if this is a _direct option (format: "_direct|filename.png")
    if (selection.startsWith('_direct|')) {
      const filename = selection.split('|')[1];
      img.src = `${CDN_BASE}/${currentSpecies}/${traitType}/${filename}`;
      img.style.display = 'block';
      return;
    }
    
    const typeName = selection; // selection is the type name for nested traits
    
    // For nested traits, get the skin color from the selected Skin
    const skinSelection = currentSelections['Skin'];
    if (!skinSelection) {
      img.style.display = 'none';
      return;
    }
    
    // Get the skin color filename (remove .png if present)
    let skinColorFile = skinSelection.replace(/\.png$/i, '');
    
    // Check if this skin color is available for this type
    const availableSkins = getSkinColorsForNestedTrait(currentSpecies, traitType, typeName);
    const matchingSkin = availableSkins.find(s => {
      const sClean = s.replace(/\.png$/i, '');
      return sClean === skinColorFile || s === skinColorFile;
    });
    
    if (!matchingSkin) {
      // Try to find a close match or use the first available
      const firstAvailable = availableSkins[0];
      if (firstAvailable) {
        skinColorFile = firstAvailable;
      } else {
        img.style.display = 'none';
        return;
      }
    } else {
      skinColorFile = matchingSkin;
    }
    
    img.src = `${CDN_BASE}/${currentSpecies}/${traitType}/${typeName}/${skinColorFile}`;
  } else {
    // Simple trait
    img.src = buildTraitUrl(currentSpecies, traitType, selection);
  }
  
  img.style.display = 'block';
  
  // If this is a Mouth change and we have Tusk, rebuild Tusk options
  if (traitType === 'Mouth' && isNestedTrait(currentSpecies, 'Tusk')) {
    rebuildTuskOptions();
  }
}

/**
 * Rebuild Tusk options based on selected Mouth type
 */
function rebuildTuskOptions() {
  const tuskSelect = document.getElementById('select-Tusk');
  if (!tuskSelect) return;
  
  const mouthSelection = currentSelections['Mouth'];
  if (!mouthSelection) {
    tuskSelect.innerHTML = '<option value="">Select Mouth first</option>';
    return;
  }
  
  const mouthType = mouthSelection.split('|')[0];
  const tuskData = traitManifest[currentSpecies]['Tusk'];
  
  // Get available tusk options for this mouth type
  let options = [];
  if (tuskData[mouthType] && Array.isArray(tuskData[mouthType])) {
    options = tuskData[mouthType];
  } else if (tuskData['_direct']) {
    options = tuskData['_direct'];
  }
  
  // Clear and rebuild options
  tuskSelect.innerHTML = '';
  const placeholder = createElement('option', { value: '' }, [document.createTextNode('Select Tusk')]);
  tuskSelect.appendChild(placeholder);
  
  options.forEach(filename => {
    const label = filename.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
    const option = createElement('option', { value: filename }, [document.createTextNode(label)]);
    tuskSelect.appendChild(option);
  });
  
  // If there's a previous selection that's still valid, keep it
  // Otherwise, select the first option
  if (options.length > 0) {
    const previousValue = currentSelections['Tusk'];
    if (previousValue && options.includes(previousValue)) {
      tuskSelect.value = previousValue;
    } else {
      tuskSelect.value = options[0];
      updateTrait('Tusk', options[0]);
    }
  }
}

/**
 * Build the UI controls based on the selected species
 */
function buildUI(species) {
  const controlsContainer = document.getElementById('controls');
  const preview = document.getElementById('preview');

  // Clear existing controls
  controlsContainer.innerHTML = '';
  preview.innerHTML = '';
  currentSelections = {};
  
  if (!traitManifest || !traitManifest[species]) {
    console.error('No manifest data for species:', species);
    return;
  }

  const speciesData = traitManifest[species];
  
  // Filter trait order to only include traits that exist for this species
  const traitOrder = TRAIT_ORDER.filter(trait => {
    // Check if trait exists in species data
    if (speciesData[trait]) return true;
    // Check shared traits for Clothes
    if (trait === 'Clothes' && traitManifest.shared && traitManifest.shared.Clothes) return true;
    return false;
  });
  
  console.log('Building UI for species:', species, 'with traits:', traitOrder);
  
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
    let options = [];
    
    // Handle shared traits (Clothes)
    if (trait === 'Clothes' && traitManifest.shared && traitManifest.shared.Clothes) {
      options = traitManifest.shared.Clothes;
    } else {
      options = getTraitOptions(species, trait);
    }
    
    if (options.length === 0) return;
    
    // For nested traits, show type names only (except Tusk which shows filenames)
    if (isNestedTrait(species, trait)) {
      // Special handling for Tusk - it shows filenames, not types
      if (trait === 'Tusk') {
    const selectEl = createElement('select', {
      id: `select-${trait}`,
      onChange: (e) => updateTrait(trait, e.target.value)
        });
        
        // Add placeholder option
        const placeholder = createElement('option', { value: '' }, [document.createTextNode('Select Mouth first')]);
        selectEl.appendChild(placeholder);
        
        // Options will be populated when Mouth is selected
    const labelEl = createElement('label', { htmlFor: `select-${trait}` }, [
      document.createTextNode(trait.charAt(0).toUpperCase() + trait.slice(1))
    ]);
    
        const group = createElement('div', { className: 'control-group' }, [labelEl, selectEl]);
        controlsContainer.appendChild(group);
      } else {
        // For Eyes and Mouth - show type names
        const selectEl = createElement('select', {
          id: `select-${trait}`,
          onChange: (e) => updateTrait(trait, e.target.value)
        });
        
        // Add placeholder option
        const placeholder = createElement('option', { value: '' }, [document.createTextNode('Select ' + trait)]);
        selectEl.appendChild(placeholder);
        
        // Add options for each type
        // For _direct, we need to add each direct option separately
        options.forEach(typeName => {
          if (typeName === '_direct') {
            // Add each _direct option
            const directOptions = traitManifest[species][trait]['_direct'];
            if (directOptions && Array.isArray(directOptions)) {
              directOptions.forEach(filename => {
                const label = filename.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
                const option = createElement('option', { value: `_direct|${filename}` }, [document.createTextNode(label)]);
                selectEl.appendChild(option);
              });
            }
          } else {
            const label = typeName.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
            const option = createElement('option', { value: typeName }, [document.createTextNode(label)]);
            selectEl.appendChild(option);
          }
        });
        
        const labelEl = createElement('label', { htmlFor: `select-${trait}` }, [
          document.createTextNode(trait.charAt(0).toUpperCase() + trait.slice(1))
        ]);
        
        const group = createElement('div', { className: 'control-group' }, [labelEl, selectEl]);
    controlsContainer.appendChild(group);
      }
    } else {
      // Simple traits (arrays)
      const selectEl = createElement('select', {
        id: `select-${trait}`,
        onChange: (e) => updateTrait(trait, e.target.value)
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
    }
  });
  
  // Initialize with first option for Skin (required for nested traits)
  const skinSelect = document.getElementById('select-Skin');
  if (skinSelect && skinSelect.options.length > 1) {
    skinSelect.value = skinSelect.options[1].value;
    updateTrait('Skin', skinSelect.value);
  }
}

/**
 * Handle species selection change
 */
function onSpeciesChange(species) {
  currentSpecies = species;
  if (species) {
    buildUI(species);
  } else {
    // Clear UI
    document.getElementById('controls').innerHTML = '';
    document.getElementById('preview').innerHTML = '';
    currentSelections = {};
  }
}

/**
 * Generate a random trait set
 */
function randomizeTraits() {
  if (!currentSpecies) {
    alert('Please select a species first');
    return;
  }
  
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
  console.log('Initializing application...');
  
  try {
    // Load the trait manifest
    await loadTraitManifest();
    
    // Set up species selector
    const speciesSelect = document.getElementById('species-select');
    if (speciesSelect) {
      speciesSelect.addEventListener('change', (e) => {
        onSpeciesChange(e.target.value);
      });
    }
    
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
