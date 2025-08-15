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
          large_image: 'https://joshuahamsa.com/trait-tester/discord-activity/assets/large-image.png',
          large_text: 'Ravager Trait Tester',
          small_image: 'https://joshuahamsa.com/trait-tester/discord-activity/assets/small-image.png',
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
          large_image: 'https://joshuahamsa.com/trait-tester/discord-activity/assets/large-image.png',
          large_text: 'Ravager Trait Tester',
          small_image: 'https://joshuahamsa.com/trait-tester/discord-activity/assets/small-image.png',
          small_text: state
        }
      });
    } catch (error) {
      console.error('Failed to update activity state:', error);
    }
  }

  setupTraitListeners() {
    // Wait for the main script to fully initialize
    const checkInit = () => {
      if (typeof window.updateTrait === 'function' && typeof window.randomizeTraits === 'function') {
        // Wait a bit more to ensure initial traits are set
        setTimeout(() => {
          this.hookIntoTraitUpdates();
        }, 100);
      } else {
        setTimeout(checkInit, 100);
      }
    };
    checkInit();
  }

  hookIntoTraitUpdates() {
    // Store the original updateTrait function
    const originalUpdateTrait = window.updateTrait;
    
    // Override the updateTrait function to track changes
    window.updateTrait = (trait, filename) => {
      // Call the original function
      originalUpdateTrait(trait, filename);
      
      // Update our tracking
      this.currentTraits[trait] = filename;
      
      // Update Discord activity
      this.updateTraitActivity();
    };

    // Also hook into the randomize function
    const originalRandomizeTraits = window.randomizeTraits;
    if (originalRandomizeTraits) {
      window.randomizeTraits = () => {
        originalRandomizeTraits();
        this.updateActivityState('Randomizing traits', 'Generating random combinations');
      };
    }

    // Initialize current traits from existing selections
    this.initializeCurrentTraits();
  }

  initializeCurrentTraits() {
    // Get current trait selections from the UI
    const controlsContainer = document.getElementById('controls');
    if (controlsContainer) {
      const selectElements = controlsContainer.querySelectorAll('select[id^="select-"]');
      selectElements.forEach(select => {
        const traitType = select.id.replace('select-', '');
        if (select.value) {
          this.currentTraits[traitType] = select.value;
        }
      });
    }
    
    // Update Discord activity with current state
    this.updateTraitActivity();
  }

  updateTraitActivity() {
    // Count how many traits are selected
    const selectedTraits = Object.values(this.currentTraits).filter(trait => trait && trait !== '');
    const totalTraits = Object.keys(this.currentTraits).length;
    
    if (selectedTraits.length === 0) {
      this.updateActivityState('Browsing traits', 'Selecting trait combinations');
    } else if (selectedTraits.length === totalTraits) {
      this.updateActivityState('Complete combination', `${selectedTraits.length} traits selected`);
    } else {
      this.updateActivityState('Building combination', `${selectedTraits.length}/${totalTraits} traits selected`);
    }
  }

  getCurrentTraitSummary() {
    const summary = [];
    Object.entries(this.currentTraits).forEach(([trait, filename]) => {
      if (filename) {
        const traitName = filename.replace('.png', '').replace(/^[A-Z]+ /, '');
        summary.push(`${trait}: ${traitName}`);
      }
    });
    return summary.join(', ');
  }
}

// Initialize Discord Activity Manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait longer for the main script to fully load and initialize
  setTimeout(() => {
    window.discordActivityManager = new DiscordActivityManager();
  }, 1000);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiscordActivityManager;
}
