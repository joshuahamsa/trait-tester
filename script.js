/*
 * script.js
 *
 * This file implements the core logic for the trait tester app.
 * It supports both ape and hog species with the new CDN directory structure.
 *
 * CORS/CORB Requirements:
 * - The CDN (baysed.b-cdn.net) must send Access-Control-Allow-Origin header for images
 *   to allow canvas operations (required for Tusk image splitting)
 * - GitHub Pages should serve JSON files with correct Content-Type automatically
 * - If CORB errors occur, check that the CDN is configured to allow cross-origin requests
 */

// Define the layering order from bottom to top (Tusk is handled separately with split layers)
const TRAIT_ORDER = ["Skin", "Clothes", "Mouth", "Eyes", "Headwear"];

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
    // Use absolute path to avoid CORB issues on GitHub Pages
    const manifestPath = 'detailed_trait_manifest.json';
    const response = await fetch(manifestPath, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.statusText}`);
    }
    
    // Check Content-Type to avoid CORB issues
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Warning: Manifest may not have correct Content-Type header');
    }
    
    traitManifest = await response.json();
    console.log('Loaded trait manifest:', traitManifest);
    return traitManifest;
  } catch (error) {
    console.error('Error loading trait manifest:', error);
    // If fetch fails, try alternative method
    if (error.name === 'TypeError' || error.message.includes('CORB') || error.message.includes('CORS')) {
      console.error('CORB/CORS issue detected. This may be a server configuration problem.');
    }
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
 * Split an image in half and return data URLs for left and right halves
 * Uses fetch API with proper CORS handling to avoid CORB issues
 * @param {string} imageUrl - URL of the image to split
 * @returns {Promise<{left: string, right: string}>} - Data URLs for left and right halves
 */
async function splitImageInHalf(imageUrl) {
  try {
    // First, try to fetch the image as a blob to handle CORS properly
    // This method works better with CORS than Image element + canvas
    if (typeof createImageBitmap === 'undefined') {
      // Browser doesn't support createImageBitmap, skip to fallback
      throw new Error('createImageBitmap not supported');
    }
    
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    
    const width = imageBitmap.width;
    const height = imageBitmap.height;
    const halfWidth = Math.floor(width / 2);
    
    // Create canvas for left half (left side of image, x: 0 to width/2)
    const leftCanvas = document.createElement('canvas');
    leftCanvas.width = halfWidth;
    leftCanvas.height = height;
    const leftCtx = leftCanvas.getContext('2d');
    leftCtx.drawImage(imageBitmap, 0, 0, halfWidth, height, 0, 0, halfWidth, height);
    
    // Create canvas for right half (right side of image, x: width/2 to width)
    const rightCanvas = document.createElement('canvas');
    rightCanvas.width = halfWidth;
    rightCanvas.height = height;
    const rightCtx = rightCanvas.getContext('2d');
    rightCtx.drawImage(imageBitmap, halfWidth, 0, halfWidth, height, 0, 0, halfWidth, height);
    
    const leftDataUrl = leftCanvas.toDataURL('image/png');
    const rightDataUrl = rightCanvas.toDataURL('image/png');
    
    console.log('Image split successfully, data URLs created');
    return {
      left: leftDataUrl,
      right: rightDataUrl
    };
  } catch (fetchError) {
    // Fallback to Image element method if fetch fails
    console.warn('Fetch method failed, trying Image element fallback:', fetchError);
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Try to handle CORS - if the CDN supports it, this will work
      img.crossOrigin = 'anonymous';
      
      img.onload = function() {
        try {
          console.log('Image loaded via fallback, dimensions:', img.width, 'x', img.height);
          const width = img.width;
          const height = img.height;
          const halfWidth = Math.floor(width / 2);
          
          // Create canvas for left half (left side of image, x: 0 to width/2)
          const leftCanvas = document.createElement('canvas');
          leftCanvas.width = halfWidth;
          leftCanvas.height = height;
          const leftCtx = leftCanvas.getContext('2d');
          leftCtx.drawImage(img, 0, 0, halfWidth, height, 0, 0, halfWidth, height);
          
          // Create canvas for right half (right side of image, x: width/2 to width)
          const rightCanvas = document.createElement('canvas');
          rightCanvas.width = halfWidth;
          rightCanvas.height = height;
          const rightCtx = rightCanvas.getContext('2d');
          rightCtx.drawImage(img, halfWidth, 0, halfWidth, height, 0, 0, halfWidth, height);
          
          const leftDataUrl = leftCanvas.toDataURL('image/png');
          const rightDataUrl = rightCanvas.toDataURL('image/png');
          
          console.log('Image split successfully via fallback, data URLs created');
          resolve({
            left: leftDataUrl,
            right: rightDataUrl
          });
        } catch (error) {
          console.error('Error processing image in fallback:', error);
          // If canvas operations fail due to CORB, show the full image instead
          if (error.message && (error.message.includes('tainted') || error.message.includes('CORB'))) {
            console.error('CORB/CORS issue: Cannot split image. CDN needs to send Access-Control-Allow-Origin header.');
            // Return the full image as both halves as a workaround
            const fullCanvas = document.createElement('canvas');
            fullCanvas.width = img.width;
            fullCanvas.height = img.height;
            const fullCtx = fullCanvas.getContext('2d');
            fullCtx.drawImage(img, 0, 0);
            const fullDataUrl = fullCanvas.toDataURL('image/png');
            resolve({
              left: fullDataUrl,
              right: fullDataUrl
            });
          } else {
            reject(error);
          }
        }
      };
      
      img.onerror = function(error) {
        console.error('Failed to load image for splitting:', imageUrl, error);
        // Try without CORS as last resort
        if (img.crossOrigin === 'anonymous') {
          console.log('Retrying without CORS...');
          const img2 = new Image();
          img2.onload = img.onload;
          img2.onerror = () => {
            reject(new Error('Failed to load image for splitting. CDN may need CORS headers configured.'));
          };
          img2.src = imageUrl;
        } else {
          reject(new Error('Failed to load image for splitting'));
        }
      };
      
      img.src = imageUrl;
    });
  }
}

/**
 * Update the base mouth layer for hogs (only shown for direct mouths, not nested)
 */
function updateBaseMouth() {
  if (currentSpecies !== 'hog') return;
  
  const baseMouthImg = document.getElementById('layer-Mouth-Base');
  if (!baseMouthImg) return;
  
  // Check if a mouth is selected
  const mouthSelection = currentSelections['Mouth'];
  if (!mouthSelection) {
    baseMouthImg.style.display = 'none';
    return;
  }
  
  const mouthData = traitManifest[currentSpecies]['Mouth'];
  
  // Determine if this is a direct mouth or nested mouth
  // Direct mouths: _direct|filename.png or simple filenames from root
  // Nested mouths: type names like "Bite Lips", "Happy", etc. (keys in the object)
  
  let isDirectMouth = false;
  
  if (mouthSelection.startsWith('_direct|')) {
    // This is explicitly a direct mouth
    isDirectMouth = true;
  } else if (mouthData && typeof mouthData === 'object' && !Array.isArray(mouthData)) {
    // Check if the selection is a type name (key in the object)
    const mouthType = mouthSelection.split('|')[0];
    if (mouthData[mouthType] && Array.isArray(mouthData[mouthType]) && mouthType !== '_direct') {
      // This is a nested mouth type - don't show base mouth
      baseMouthImg.style.display = 'none';
      return;
    } else {
      // Not a nested type, must be a direct mouth
      isDirectMouth = true;
    }
  } else {
    // Mouth data is an array, so all mouths are direct
    isDirectMouth = true;
  }
  
  // If it's not a direct mouth, hide base mouth
  if (!isDirectMouth) {
    baseMouthImg.style.display = 'none';
    return;
  }
  
  // This is a direct mouth - show base mouth with matching skin
  const skinSelection = currentSelections['Skin'];
  if (!skinSelection) {
    baseMouthImg.style.display = 'none';
    return;
  }
  
  // Get the skin name (filename without .png)
  const skinName = skinSelection.replace(/\.png$/i, '');
  
  // Check if Base mouth has a matching variant
  if (mouthData && mouthData['Base'] && Array.isArray(mouthData['Base'])) {
    // Find matching base mouth variant by skin name
    const matchingBase = mouthData['Base'].find(baseFile => {
      const baseName = baseFile.replace(/\.png$/i, '');
      return baseName === skinName;
    });
    
    if (matchingBase) {
      baseMouthImg.src = `${CDN_BASE}/${currentSpecies}/Mouth/Base/${matchingBase}`;
      baseMouthImg.style.display = 'block';
      return;
    }
  }
  
  // Hide base mouth if no match
  baseMouthImg.style.display = 'none';
}

/**
 * Update the preview for a single trait when the selection changes.
 */
function updateTrait(traitType, selection) {
  // Special handling for Tusk (split into two layers) - handles both nested (hog) and simple (ape) cases
  if (traitType === 'Tusk') {
    if (!selection || selection === 'None' || selection === '') {
      const tuskRightImg = document.getElementById('layer-Tusk-Right');
      const tuskLeftImg = document.getElementById('layer-Tusk-Left');
      if (tuskRightImg) {
        tuskRightImg.style.display = 'none';
        tuskRightImg.src = '';
      }
      if (tuskLeftImg) {
        tuskLeftImg.style.display = 'none';
        tuskLeftImg.src = '';
      }
      currentSelections[traitType] = null;
      return;
    }

    // Store the selection
    currentSelections[traitType] = selection;
    
    // Build the Tusk image URL - handle both nested (hog) and simple (ape) cases
    let tuskImageUrl;
    const tuskData = traitManifest[currentSpecies]['Tusk'];
    const tuskFilename = selection;
    
    if (isNestedTrait(currentSpecies, traitType)) {
      // Nested Tusk (hog) - depends on Mouth type
      const mouthSelection = currentSelections['Mouth'];
      if (!mouthSelection) {
        const tuskRightImg = document.getElementById('layer-Tusk-Right');
        const tuskLeftImg = document.getElementById('layer-Tusk-Left');
        if (tuskRightImg) tuskRightImg.style.display = 'none';
        if (tuskLeftImg) tuskLeftImg.style.display = 'none';
        return;
      }
      
      const mouthType = mouthSelection.split('|')[0];
      
      // Check if this mouth type has specific Tusk options
      if (mouthType === '_direct') {
        // For _direct mouths, tusks are in the root Tusk directory
        tuskImageUrl = `${CDN_BASE}/${currentSpecies}/${traitType}/${tuskFilename}`;
      } else if (tuskData[mouthType] && Array.isArray(tuskData[mouthType])) {
        // Mouth-dependent tusk: hog/Tusk/[mouthType]/[filename].png
        tuskImageUrl = `${CDN_BASE}/${currentSpecies}/${traitType}/${mouthType}/${tuskFilename}`;
      } else {
        // Fall back to root path for mouth types that don't have specific Tusk options
        // These use _direct Tusk options from the manifest, but files are in root directory
        tuskImageUrl = `${CDN_BASE}/${currentSpecies}/${traitType}/${tuskFilename}`;
      }
    } else {
      // Simple Tusk (ape) - direct path
      tuskImageUrl = `${CDN_BASE}/${currentSpecies}/${traitType}/${tuskFilename}`;
    }
    
    // Split the image and assign to left and right layers
    const tuskRightImg = document.getElementById('layer-Tusk-Right');
    const tuskLeftImg = document.getElementById('layer-Tusk-Left');
    
    if (tuskRightImg && tuskLeftImg) {
      console.log('Splitting Tusk image:', tuskImageUrl);
      splitImageInHalf(tuskImageUrl)
        .then(({ left, right }) => {
          console.log('Tusk image split successfully');
          // Right half (right side of image) goes between Skin and Clothes
          tuskRightImg.src = right;
          tuskRightImg.style.display = 'block';
          
          // Left half (left side of image) goes above Mouth
          tuskLeftImg.src = left;
          tuskLeftImg.style.display = 'block';
        })
        .catch((error) => {
          console.error('Error splitting Tusk image:', error);
          console.error('Image URL was:', tuskImageUrl);
          if (tuskRightImg) tuskRightImg.style.display = 'none';
          if (tuskLeftImg) tuskLeftImg.style.display = 'none';
        });
    } else {
      console.error('Tusk layers not found:', { tuskRightImg, tuskLeftImg });
    }
    return;
  }
  
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
  
  // Handle shared traits (Clothes)
  if (traitType === 'Clothes' && traitManifest.shared && traitManifest.shared.Clothes) {
    img.src = `${CDN_BASE}/shared/Clothes/${selection}`;
    img.style.display = 'block';
    return;
  }
  
  // For nested traits, we need to get the actual skin color
  if (isNestedTrait(currentSpecies, traitType)) {
    
    // For Eyes and Mouth
    // Check if this is a _direct option (format: "_direct|filename.png")
    if (selection.startsWith('_direct|')) {
      const filename = selection.split('|')[1];
      img.src = `${CDN_BASE}/${currentSpecies}/${traitType}/${filename}`;
      img.style.display = 'block';
      
      // For hogs, show base mouth layer when a direct mouth is selected
      if (traitType === 'Mouth' && currentSpecies === 'hog') {
        updateBaseMouth();
      }
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
    
    // For hogs, hide base mouth layer when a nested mouth is selected
    if (traitType === 'Mouth' && currentSpecies === 'hog') {
      const baseMouthImg = document.getElementById('layer-Mouth-Base');
      if (baseMouthImg) {
        baseMouthImg.style.display = 'none';
      }
    }
  } else {
    // Simple trait
    img.src = buildTraitUrl(currentSpecies, traitType, selection);
    
    // For hogs, show base mouth layer when a simple mouth is selected
    if (traitType === 'Mouth' && currentSpecies === 'hog') {
      updateBaseMouth();
    }
  }
  
  img.style.display = 'block';
  
  // If this is a Mouth change and we have Tusk, rebuild Tusk options
  if (traitType === 'Mouth' && isNestedTrait(currentSpecies, 'Tusk')) {
    rebuildTuskOptions();
  }
  
  // If this is a Skin change and we're on hogs, update base mouth
  if (traitType === 'Skin' && currentSpecies === 'hog') {
    updateBaseMouth();
  }
}

/**
 * Rebuild Tusk options based on selected Mouth type
 */
function rebuildTuskOptions() {
  const tuskSelect = document.getElementById('select-Tusk');
  if (!tuskSelect) {
    console.log('Tusk select not found');
    return;
  }
  
  const mouthSelection = currentSelections['Mouth'];
  if (!mouthSelection) {
    console.log('No mouth selection, clearing Tusk options');
    tuskSelect.innerHTML = '<option value="">Select Mouth first</option>';
    return;
  }
  
  const mouthType = mouthSelection.split('|')[0];
  const tuskData = traitManifest[currentSpecies]['Tusk'];
  
  console.log('Rebuilding Tusk options for mouth type:', mouthType);
  console.log('Available Tusk keys:', Object.keys(tuskData || {}));
  
  // Get available tusk options for this mouth type
  // First check if this mouth type has specific Tusk options
  // If not, fall back to _direct options
  let options = [];
  if (tuskData && tuskData[mouthType] && Array.isArray(tuskData[mouthType])) {
    options = tuskData[mouthType];
    console.log('Found Tusk options for mouth type:', mouthType, 'options:', options.length);
  } else {
    // Fall back to _direct options for any mouth type that doesn't have specific Tusk options
    if (tuskData && tuskData['_direct'] && Array.isArray(tuskData['_direct'])) {
      options = tuskData['_direct'];
      console.log('Using _direct Tusk options for mouth type:', mouthType, 'options:', options.length);
    } else {
      console.warn('No Tusk options found (neither specific nor _direct) for mouth type:', mouthType);
    }
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
      console.log('Keeping previous Tusk selection:', previousValue);
    } else {
      tuskSelect.value = options[0];
      console.log('Auto-selecting first Tusk option:', options[0]);
      updateTrait('Tusk', options[0]);
    }
  } else {
    console.warn('No Tusk options available to select');
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
  let layerIndex = 0;
  traitOrder.forEach((trait) => {
    const img = createElement('img', {
      id: `layer-${trait}`,
      alt: trait,
      style: `z-index: ${layerIndex}; display: none;`
    });
    
    // Add Tusk-Right layer after Skin (between Skin and Clothes)
    if (trait === 'Skin') {
      preview.appendChild(img);
      layerIndex++;
      
      // Add Tusk-Right layer (right half, left side of image)
      const hasTusk = speciesData['Tusk'] || (traitManifest[species] && traitManifest[species]['Tusk']);
      if (hasTusk) {
        console.log('Creating Tusk-Right layer');
        const tuskRightImg = createElement('img', {
          id: 'layer-Tusk-Right',
          alt: 'Tusk Right',
          style: `z-index: ${layerIndex}; display: none;`
        });
        preview.appendChild(tuskRightImg);
        layerIndex++;
      } else {
        console.log('No Tusk data found for species:', species, 'speciesData:', speciesData);
      }
      return;
    }
    
    // For hogs, add a Mouth-Base layer before Mouth (below Mouth layer)
    if (species === 'hog' && trait === 'Mouth') {
      const baseMouthImg = createElement('img', {
        id: 'layer-Mouth-Base',
        alt: 'Mouth Base',
        style: `z-index: ${layerIndex}; display: none;`
      });
      preview.appendChild(baseMouthImg);
      layerIndex++; // Increment for the base mouth layer
    }
    
    preview.appendChild(img);
    layerIndex++;
    
    // Add Tusk-Left layer after Mouth (above Mouth)
    if (trait === 'Mouth') {
      // Add Tusk-Left layer (left half, right side of image)
      const hasTusk = speciesData['Tusk'] || (traitManifest[species] && traitManifest[species]['Tusk']);
      if (hasTusk) {
        console.log('Creating Tusk-Left layer');
        const tuskLeftImg = createElement('img', {
          id: 'layer-Tusk-Left',
          alt: 'Tusk Left',
          style: `z-index: ${layerIndex}; display: none;`
        });
        preview.appendChild(tuskLeftImg);
        layerIndex++;
      }
    }
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
  
  // Add Tusk control separately (not in TRAIT_ORDER since it's split into two layers)
  if (speciesData['Tusk'] || (traitManifest[species] && traitManifest[species]['Tusk'])) {
    const tuskOptions = getTraitOptions(species, 'Tusk');
    const isNested = isNestedTrait(species, 'Tusk');
    
    if (tuskOptions.length > 0 || isNested) {
      const selectEl = createElement('select', {
        id: 'select-Tusk',
        onChange: (e) => updateTrait('Tusk', e.target.value)
      });
      
      // Add placeholder option
      if (isNested) {
        const placeholder = createElement('option', { value: '' }, [document.createTextNode('Select Mouth first')]);
        selectEl.appendChild(placeholder);
        // Options will be populated when Mouth is selected (handled by rebuildTuskOptions)
      } else {
        // For simple Tusk (ape), add options immediately
        const placeholder = createElement('option', { value: '' }, [document.createTextNode('Select Tusk')]);
        selectEl.appendChild(placeholder);
        
        // Add all Tusk options
        tuskOptions.forEach(filename => {
          const label = filename.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
          const option = createElement('option', { value: filename }, [document.createTextNode(label)]);
          selectEl.appendChild(option);
        });
      }
      
      const labelEl = createElement('label', { htmlFor: 'select-Tusk' }, [
        document.createTextNode('Tusk')
      ]);
      
      const group = createElement('div', { className: 'control-group' }, [labelEl, selectEl]);
      controlsContainer.appendChild(group);
    }
  }
  
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
