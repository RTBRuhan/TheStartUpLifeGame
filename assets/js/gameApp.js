/**
 * Game Application
 * Main orchestrator that initializes and runs the game
 */

// Global game instance
let gameEngine;
let gameUI;

/**
 * Initialize the game
 */
async function initializeGame() {
  try {
    console.log('🚀 Initializing Startup Life Game...');
    
    // Initialize game engine
    gameEngine = new GameEngine();
    
    // Initialize UI controller
    gameUI = new GameUI(gameEngine);
    gameUI.initialize();
    
    // Check for saved game
    checkForSavedGame();
    
    console.log('✅ Game initialized successfully!');
    
  } catch (error) {
    console.error('❌ Failed to initialize game:', error);
    alert('Failed to load game. Please refresh the page.');
  }
}

/**
 * Check for saved game
 */
function checkForSavedGame() {
  const savedData = localStorage.getItem('startup-life-save');
  if (savedData) {
    const shouldLoad = confirm('📌 Found a saved game! Would you like to continue?');
    if (shouldLoad) {
      try {
        // TODO: Implement load game functionality
        console.log('Loading saved game...');
      } catch (error) {
        console.error('Failed to load saved game:', error);
        localStorage.removeItem('startup-life-save');
      }
    }
  }
}

/**
 * Export game report as JSON
 */
function exportGameReport() {
  if (!gameEngine) return;
  
  const report = gameEngine.getGameReport();
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `startup-life-${report.startupName}-${Date.now()}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  initializeGame();
}

// Make functions available globally
window.exportGameReport = exportGameReport;
window.gameEngine = () => gameEngine;
window.gameUI = () => gameUI;

