/**
 * Discord Activity Integration for Ravager Trait Tester
 * 
 * This file handles Discord Activity SDK integration, rich presence updates,
 * and activity state management for the dressup game.
 */

class DiscordActivityManager {
  constructor() {
    this.activity = null;
    this.isConnected = false;
    this.currentTraits = {};
    this.startTime = Date.now();
    this.statusElement = document.getElementById('activity-status');
    
    this.init();
  }

  async init() {
    try {
      this.updateStatus('Initializing Discord Activity...');
      
      // Check if Discord Activity SDK is available
      if (typeof DiscordActivitySDK === 'undefined') {
        console.warn('Discord Activity SDK not available, running in standalone mode');
        this.updateStatus('Standalone Mode');
        return;
      }

      // Initialize Discord Activity SDK
      this.activity = new DiscordActivitySDK.Activity({
        name: 'Ravager Trait Tester',
        type: 'ACTIVITY',
        description: 'Test and preview trait combinations for Ravager NFTs',
        supported_platforms: ['desktop'],
        supported_locales: ['en-US'],
        launch_url: window.location.href,
        activity_party: {
          id: 'ravager-trait-tester',
          size: [1, 1]
        },
        assets: {
          large_image: 'https://joshuahamsa.com/trait-tester/assets/large-image.png',
          large_text: 'Ravager Trait Tester',
          small_image: 'https://joshuahamsa.com/trait-tester/assets/small-image.png',
          small_text: 'Testing traits'
        }
      });

      // Connect to Discord
      await this.activity.connect();
      this.isConnected = true;
      this.updateStatus('Connected to Discord');
      
      // Set initial activity state
      this.updateActivityState('Browsing traits', 'Testing trait combinations');
      
      // Listen for trait changes
      this.setupTraitListeners();
      
    } catch (error) {
      console.error('Failed to initialize Discord Activity:', error);
      this.updateStatus('Discord connection failed');
    }
  }

  updateStatus(message) {
    if (this.statusElement) {
      this.statusElement.textContent = message;
    }
    console.log('Discord Activity Status:', message);
  }

  async updateActivityState(state, details) {
    if (!this.isConnected || !this.activity) {
      return;
    }

    try {
      await this.activity.setActivity({
        state: state,
        details: details,
        timestamps: {
          start: this.startTime
        },
        assets: {
          large_image: 'https://joshuahamsa.com/trait-tester/assets/large-image.png',
          large_text: 'Ravager Trait Tester',
          small_image: 'https://joshuahamsa.com/trait-tester/assets/small-image.png',
          small_text: state
        }
      });
    } catch (error) {
      console.error('Failed to update activity state:', error);
    }
  }

  setupTraitListeners() {
    // Listen for trait changes from the main script
    const originalUpdateTrait = window.updateTrait;
    window.updateTrait = (trait, filename) => {
      // Call the original function
      if (originalUpdateTrait) {
        originalUpdateTrait(trait, filename);
      }
      
      // Update Discord activity
      this.currentTraits[trait] = filename;
      this.updateActivityFromTraits();
    };

    // Listen for randomization
    const originalRandomizeTraits = window.randomizeTraits;
    window.randomizeTraits = () => {
      // Call the original function
      if (originalRandomizeTraits) {
        originalRandomizeTraits();
      }
      
      // Update Discord activity
      setTimeout(() => {
        this.updateActivityFromTraits();
        this.updateActivityState('Randomized traits', 'Generated new combination');
      }, 100);
    };
  }

  updateActivityFromTraits() {
    if (!this.isConnected) return;

    const traitCount = Object.keys(this.currentTraits).length;
    const activeTraits = Object.values(this.currentTraits).filter(trait => trait).length;
    
    let state = 'Browsing traits';
    let details = `Testing trait combinations (${activeTraits}/${traitCount} selected)`;
    
    // Create more specific state based on current traits
    if (activeTraits > 0) {
      const traitNames = Object.entries(this.currentTraits)
        .filter(([_, value]) => value)
        .map(([category, filename]) => {
          const name = filename.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
          return `${category}: ${name}`;
        })
        .slice(0, 2); // Show first 2 traits
      
      if (traitNames.length > 0) {
        state = traitNames.join(', ');
        if (activeTraits > 2) {
          state += ` +${activeTraits - 2} more`;
        }
      }
    }

    this.updateActivityState(state, details);
  }

  // Method to share current combination
  async shareCombination() {
    if (!this.isConnected) {
      alert('Discord not connected. Combination copied to clipboard instead.');
      this.copyCombinationToClipboard();
      return;
    }

    try {
      const combination = this.getCurrentCombination();
      await this.activity.share({
        title: 'Ravager Trait Combination',
        text: `Check out this Ravager trait combination: ${combination}`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Failed to share combination:', error);
      this.copyCombinationToClipboard();
    }
  }

  getCurrentCombination() {
    const traits = Object.entries(this.currentTraits)
      .filter(([_, value]) => value)
      .map(([category, filename]) => {
        const name = filename.replace(/\.png$/i, '').replace(/[_-]/g, ' ');
        return `${category}: ${name}`;
      });
    
    return traits.join(' | ');
  }

  copyCombinationToClipboard() {
    const combination = this.getCurrentCombination();
    navigator.clipboard.writeText(combination).then(() => {
      this.updateStatus('Combination copied to clipboard!');
      setTimeout(() => {
        this.updateStatus('Connected to Discord');
      }, 2000);
    });
  }

  // Cleanup method
  disconnect() {
    if (this.activity && this.isConnected) {
      this.activity.disconnect();
      this.isConnected = false;
      this.updateStatus('Disconnected from Discord');
    }
  }
}

// Initialize Discord Activity when the page loads
let discordManager = null;

document.addEventListener('DOMContentLoaded', () => {
  // Wait for the main script to initialize first
  setTimeout(() => {
    discordManager = new DiscordActivityManager();
  }, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (discordManager) {
    discordManager.disconnect();
  }
});

// Add share button to the UI
function addShareButton() {
  const randomizeContainer = document.getElementById('randomize-container');
  if (randomizeContainer && !document.getElementById('share-btn')) {
    const shareBtn = document.createElement('button');
    shareBtn.id = 'share-btn';
    shareBtn.innerHTML = '📤 Share Combination';
    shareBtn.style.cssText = `
      background: linear-gradient(45deg, #57f287, #3ba55c);
      border: none;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(87, 242, 135, 0.3);
      margin-left: 1rem;
    `;
    
    shareBtn.addEventListener('click', () => {
      if (discordManager) {
        discordManager.shareCombination();
      }
    });
    
    randomizeContainer.appendChild(shareBtn);
  }
}

// Add share button after a short delay
setTimeout(addShareButton, 2000);
