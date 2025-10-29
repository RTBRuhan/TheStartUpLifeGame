/**
 * Main Application
 * Orchestrates the simulation engine, visuals, and UI
 */

// Global instances
let simEngine;
let visualStages;
let uiController;
let p5Instance;

/**
 * Load transitions data and initialize app
 */
async function initApp() {
  try {
    // Load transitions data
    const response = await fetch('./data/transitions.json');
    const transitionsData = await response.json();
    
    // Initialize simulation engine
    simEngine = new SimulationEngine(transitionsData);
    
    // Initialize p5.js sketch
    const sketch = (p) => {
      p.setup = function() {
        const canvas = p.createCanvas(600, 600);
        canvas.id('p5-canvas');
        canvas.parent('visual-container');
        
        // Initialize visual stages
        visualStages = new VisualStages(p);
      };
      
      p.draw = function() {
        if (visualStages) {
          visualStages.render();
        }
      };
      
      p.windowResized = function() {
        const container = document.getElementById('visual-container');
        if (container) {
          const size = Math.min(container.clientWidth, 600);
          p.resizeCanvas(size, size);
        }
      };
    };
    
    // Create p5 instance
    p5Instance = new p5(sketch);
    
    // Initialize UI controller
    uiController = new UIController(simEngine);
    uiController.onStateChange = (newState) => {
      if (visualStages) {
        visualStages.transitionTo(newState);
      }
    };
    uiController.initialize();
    
    // Enable keyboard controls
    setupKeyboardControls();
    
    console.log('🚀 Startup Lifecycle initialized!');
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.getElementById('error-message').textContent = 
      'Failed to load application. Please refresh the page.';
    document.getElementById('error-message').classList.remove('hidden');
  }
}

/**
 * Setup keyboard controls for accessibility
 */
function setupKeyboardControls() {
  document.addEventListener('keydown', (e) => {
    // Prevent default for specific keys
    if (['Space', 'ArrowRight', 'KeyH', 'KeyC', 'KeyF', 'KeyL', 'KeyP'].includes(e.code)) {
      e.preventDefault();
    }
    
    switch(e.code) {
      case 'Space':
        // Play/Pause
        uiController.togglePlay();
        break;
      case 'ArrowRight':
        // Step forward
        if (!uiController.isPlaying) {
          uiController.handleStep();
        }
        break;
      case 'KeyH':
        // Hire
        if (simEngine.getStateInfo().canAct.hire) {
          uiController.handleAction('hire');
        }
        break;
      case 'KeyC':
        // Cut Costs
        if (simEngine.getStateInfo().canAct.cutCosts) {
          uiController.handleAction('cutCosts');
        }
        break;
      case 'KeyF':
        // Seek Funding
        if (simEngine.getStateInfo().canAct.seekFunding) {
          uiController.handleAction('seekFunding');
        }
        break;
      case 'KeyL':
        // Launch
        if (simEngine.getStateInfo().canAct.launch) {
          uiController.handleAction('launch');
        }
        break;
      case 'KeyP':
        // Pivot
        if (simEngine.getStateInfo().canAct.pivot) {
          uiController.handleAction('pivot');
        }
        break;
    }
  });
}

/**
 * Share current startup snapshot
 */
function shareSnapshot() {
  const info = simEngine.getStateInfo();
  const text = `My startup "${info.startupName}" is in the ${info.currentState} stage after ${info.tick} ticks! 🚀`;
  
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      uiController.showMessage('Snapshot copied to clipboard!');
    }).catch(() => {
      uiController.showMessage('Failed to copy to clipboard', 'error');
    });
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    uiController.showMessage('Snapshot copied to clipboard!');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export functions for global access
window.shareSnapshot = shareSnapshot;

