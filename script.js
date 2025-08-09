/*
 * script.js
 *
 * This file implements the core logic for the dress up game.  It
 * automatically reads the trait manifest (traits/manifest.json),
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
 * Load the trait manifest and build the UI.
 */
async function init() {
  // First, attempt to read the manifest from the embedded script tag.  This
  // allows the app to run when opened via the file:// protocol (where
  // fetching local files is restricted).  If no embedded manifest is
  // found, fall back to fetching traits/manifest.json via fetch.
  const embedded = document.getElementById('trait-manifest');
  if (embedded && embedded.textContent) {
    try {
      const manifest = JSON.parse(embedded.textContent);
      buildUI(manifest);
      return;
    } catch (err) {
      console.error('Failed to parse embedded manifest', err);
    }
  }
  // Fallback: fetch manifest via HTTP (works when served over http)
  try {
    const res = await fetch(MANIFEST_PATH);
    if (!res.ok) {
      throw new Error(`Failed to fetch manifest: ${res.status} ${res.statusText}`);
    }
    const manifest = await res.json();
    buildUI(manifest);
  } catch (err) {
    console.error(err);
    alert('Could not load trait manifest. Please ensure that traits/manifest.json exists and is valid JSON.');
  }
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
  // Get the manifest data from the embedded script tag
  const embedded = document.getElementById('trait-manifest');
  if (!embedded || !embedded.textContent) {
    console.error('No trait manifest found');
    return;
  }

  try {
    const manifest = JSON.parse(embedded.textContent);
    
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
  } catch (err) {
    console.error('Failed to randomize traits:', err);
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