/**
 * Game UI Controller
 * Handles all UI updates, animations, and user interactions
 */

class GameUI {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.currentScreen = 'start';
  }
  
  /**
   * Initialize UI
   */
  initialize() {
    this.setupEventListeners();
  }
  
  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Start game
    document.getElementById('start-game-btn').addEventListener('click', () => this.handleStartGame());
    
    // Quick actions
    document.getElementById('exit-attempt-btn').addEventListener('click', () => this.handleAttemptExit());
    document.getElementById('save-game-btn').addEventListener('click', () => this.handleSaveGame());
    
    // Next button
    document.getElementById('next-btn').addEventListener('click', () => this.handleNextEvent());
    
    // End game actions
    document.getElementById('play-again-btn').addEventListener('click', () => this.handlePlayAgain());
    document.getElementById('share-results-btn').addEventListener('click', () => this.handleShareResults());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.currentScreen === 'game') {
        // Check if Continue button is visible and active
        const nextBtn = document.getElementById('next-btn');
        if (e.key === 'Enter' && !nextBtn.classList.contains('hidden')) {
          this.handleNextEvent();
          return;
        }
        
        // Number keys for decisions
        if (this.game.currentEvent && ['1', '2', '3'].includes(e.key)) {
          const index = parseInt(e.key) - 1;
          this.handleDecision(index);
        }
      }
    });
  }
  
  /**
   * Handle start game
   */
  handleStartGame() {
    const founderName = document.getElementById('founder-name').value.trim() || 'Founder';
    const startupName = document.getElementById('startup-name').value.trim() || 'MyStartup';
    
    const result = this.game.startGame(startupName, founderName);
    
    if (result.success) {
      this.showScreen('game');
      this.updateUI();
      this.renderEvent();
    }
  }
  
  /**
   * Show specific screen
   */
  showScreen(screen) {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('endgame-screen').classList.add('hidden');
    
    document.getElementById(`${screen}-screen`).classList.remove('hidden');
    this.currentScreen = screen;
  }
  
  /**
   * Update all UI elements
   */
  updateUI() {
    // Header
    document.getElementById('startup-display').textContent = this.game.startupName;
    document.getElementById('stage-display').textContent = this.getStageLabel(this.game.stage);
    document.getElementById('month-display').textContent = this.game.month;
    
    // Progress
    const progress = this.game.getProgress();
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-percent').textContent = Math.round(progress);
    
    // Milestones
    Object.keys(this.game.milestones).forEach(milestone => {
      const element = document.querySelector(`[data-milestone="${milestone}"] .milestone-dot`);
      if (element) {
        if (this.game.milestones[milestone]) {
          element.classList.add('achieved');
        } else {
          element.classList.remove('achieved');
        }
      }
    });
    
    // Resources
    this.updateResources();
    
    // Co-founder
    this.updateCofounder();
    
    // Decision log
    this.updateDecisionLog();
    
    // Quick actions visibility
    this.updateQuickActions();
  }
  
  /**
   * Update resource displays
   */
  updateResources() {
    const r = this.game.resources;
    
    // Money
    document.getElementById('money-display').textContent = this.formatMoney(r.money);
    const moneyPercent = Math.max(0, Math.min(100, (r.money / 100000) * 100));
    document.getElementById('money-bar').style.width = `${moneyPercent}%`;
    
    // Team
    document.getElementById('team-display').textContent = r.team;
    
    // Product
    document.getElementById('product-display').textContent = `${r.product}%`;
    document.getElementById('product-bar').style.width = `${r.product}%`;
    
    // Users
    document.getElementById('users-display').textContent = this.formatNumber(r.users);
    
    // Revenue
    document.getElementById('revenue-display').textContent = this.formatMoney(r.revenue);
    
    // Reputation
    document.getElementById('reputation-display').textContent = `${r.reputation}%`;
    document.getElementById('reputation-bar').style.width = `${r.reputation}%`;
    
    // Morale
    document.getElementById('morale-display').textContent = `${r.morale}%`;
    document.getElementById('morale-bar').style.width = `${r.morale}%`;
  }
  
  /**
   * Update cofounder display
   */
  updateCofounder() {
    const alert = document.getElementById('cofounder-alert');
    if (this.game.cofounder) {
      alert.classList.remove('hidden');
      document.getElementById('cofounder-name').textContent = this.game.cofounder.name;
      document.getElementById('cofounder-loyalty').textContent = Math.round(this.game.cofounder.loyalty);
      
      const relationship = this.getRelationshipLabel(this.game.cofounderRelationship);
      document.getElementById('cofounder-relationship').textContent = relationship;
    } else {
      alert.classList.add('hidden');
    }
  }
  
  /**
   * Update decision log
   */
  updateDecisionLog() {
    const log = document.getElementById('decision-log');
    const recentDecisions = this.game.decisions.slice(-5).reverse();
    
    if (recentDecisions.length === 0) {
      log.innerHTML = '<p class="text-gray-500">No decisions yet...</p>';
      return;
    }
    
    log.innerHTML = recentDecisions.map(d => {
      const qualityColor = d.quality === 'good' ? 'text-green-400' : 
                          d.quality === 'bad' ? 'text-red-400' : 'text-gray-400';
      const qualityIcon = d.quality === 'good' ? '✅' : 
                          d.quality === 'bad' ? '❌' : '➖';
      return `
        <div class="p-2 bg-gray-900 rounded">
          <p class="font-semibold ${qualityColor}">${qualityIcon} ${d.event}</p>
          <p class="text-gray-500 text-xs">Month ${d.month}: ${d.choice}</p>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Update quick actions visibility
   */
  updateQuickActions() {
    const exitBtn = document.getElementById('exit-attempt-btn');
    
    if (this.game.canAttemptExit()) {
      exitBtn.classList.remove('hidden');
      exitBtn.disabled = false;
      
      // Show current valuation in button
      const valuation = this.game.calculateValuation();
      exitBtn.innerHTML = `🎯 Attempt Exit (${this.formatMoney(valuation)} valuation)`;
    } else {
      exitBtn.classList.add('hidden');
    }
  }
  
  /**
   * Render current event
   */
  renderEvent() {
    const event = this.game.currentEvent;
    if (!event) {
      // Game might be over
      if (this.game.gameEnded) {
        this.showEndGame();
      }
      return;
    }
    
    // Replace cofounder name placeholder
    const cofounderName = this.game.cofounder ? this.game.cofounder.name : 'Your Co-founder';
    const description = event.description.replace(/\$\{COFOUNDER_NAME\}/g, cofounderName);
    
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-description').textContent = description;
    
    // Render choices
    const buttonsContainer = document.getElementById('decision-buttons');
    buttonsContainer.innerHTML = '';
    
    event.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg decision-btn text-left';
      button.innerHTML = `
        <div class="flex items-start">
          <span class="text-2xl mr-3">${index + 1}</span>
          <div class="flex-1">
            <p>${choice.text}</p>
            <p class="text-sm text-gray-400 mt-1">${this.getChoiceHint(choice)}</p>
          </div>
        </div>
      `;
      button.addEventListener('click', () => this.handleDecision(index));
      buttonsContainer.appendChild(button);
    });
    
    // Hide narrative result
    document.getElementById('narrative-result').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
  }
  
  /**
   * Get hint for choice
   */
  getChoiceHint(choice) {
    const effects = choice.effect;
    const hints = [];
    
    if (effects.money) hints.push(`💰 ${effects.money > 0 ? '+' : ''}${this.formatMoney(effects.money)}`);
    if (effects.team) hints.push(`👥 ${effects.team > 0 ? '+' : ''}${effects.team}`);
    if (effects.product) hints.push(`🛠️ ${effects.product > 0 ? '+' : ''}${effects.product}%`);
    if (effects.users) hints.push(`👤 ${effects.users > 0 ? '+' : ''}${this.formatNumber(effects.users)}`);
    if (effects.reputation) hints.push(`⭐ ${effects.reputation > 0 ? '+' : ''}${effects.reputation}`);
    if (effects.morale) hints.push(`😊 ${effects.morale > 0 ? '+' : ''}${effects.morale}`);
    
    return hints.join(' • ') || 'Unknown effects';
  }
  
  /**
   * Handle decision
   */
  handleDecision(choiceIndex) {
    const result = this.game.makeDecision(choiceIndex);
    
    if (!result.success) {
      alert(result.message);
      return;
    }
    
    // Show narrative result
    document.getElementById('narrative-text').textContent = result.narrative;
    document.getElementById('narrative-result').classList.remove('hidden');
    
    // Hide decision buttons
    document.getElementById('decision-buttons').classList.add('hidden');
    
    // Show next button
    document.getElementById('next-btn').classList.remove('hidden');
    
    // Update UI
    this.updateUI();
    
    // Check if game ended
    if (result.gameOver || this.game.gameEnded) {
      setTimeout(() => this.showEndGame(), 2000);
    }
  }
  
  /**
   * Handle next event
   */
  handleNextEvent() {
    // Show decision buttons again
    document.getElementById('decision-buttons').classList.remove('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    
    // Render next event
    this.renderEvent();
    this.updateUI();
  }
  
  /**
   * Handle attempt exit
   */
  handleAttemptExit() {
    const result = this.game.attemptExit();
    
    if (result.success) {
      alert(result.message);
      setTimeout(() => this.showEndGame(), 1000);
    } else {
      alert(result.message);
    }
  }
  
  /**
   * Handle save game
   */
  handleSaveGame() {
    try {
      const saveData = JSON.stringify(this.game.exportJSON());
      localStorage.setItem('startup-life-save', saveData);
      
      // Visual feedback
      const btn = document.getElementById('save-game-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✅ Saved!';
      btn.classList.add('bg-green-700');
      btn.classList.remove('bg-gray-800');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-700');
        btn.classList.add('bg-gray-800');
      }, 2000);
    } catch (error) {
      alert('❌ Failed to save game. Please try again.');
      console.error('Save error:', error);
    }
  }
  
  /**
   * Show end game screen
   */
  showEndGame() {
    const report = this.game.getGameReport();
    
    // Title
    if (report.exitStatus === 'success') {
      document.getElementById('endgame-title').textContent = '🎉 Success! You Exited!';
      document.getElementById('endgame-subtitle').textContent = `${report.startupName} was acquired!`;
    } else {
      document.getElementById('endgame-title').textContent = '💔 Game Over';
      document.getElementById('endgame-subtitle').textContent = `${report.startupName} didn't make it`;
    }
    
    // Stats
    document.getElementById('final-valuation').textContent = this.formatMoney(report.valuation);
    document.getElementById('final-months').textContent = report.monthsSurvived;
    document.getElementById('final-score').textContent = report.score.toLocaleString();
    
    // Decisions
    document.getElementById('good-decisions').textContent = 
      `${report.decisions.good} (${report.decisions.goodPercentage}%)`;
    document.getElementById('bad-decisions').textContent = 
      `${report.decisions.bad} (${report.decisions.badPercentage}%)`;
    document.getElementById('neutral-decisions').textContent = 
      `${report.decisions.neutral} (${(100 - parseFloat(report.decisions.goodPercentage) - parseFloat(report.decisions.badPercentage)).toFixed(1)}%)`;
    
    document.getElementById('good-bar').style.width = `${report.decisions.goodPercentage}%`;
    document.getElementById('bad-bar').style.width = `${report.decisions.badPercentage}%`;
    document.getElementById('neutral-bar').style.width = 
      `${100 - parseFloat(report.decisions.goodPercentage) - parseFloat(report.decisions.badPercentage)}%`;
    
    // Achievements
    const achievements = this.generateAchievements(report);
    document.getElementById('achievements-list').innerHTML = achievements.map(a => 
      `<div class="flex items-center gap-2">
        <span class="text-2xl">${a.icon}</span>
        <span>${a.text}</span>
      </div>`
    ).join('');
    
    this.showScreen('endgame');
  }
  
  /**
   * Generate achievements based on report
   */
  generateAchievements(report) {
    const achievements = [];
    
    if (report.milestones.exit) achievements.push({ icon: '🎯', text: 'Successful Exit' });
    if (report.milestones.productMarketFit) achievements.push({ icon: '🎪', text: 'Product-Market Fit' });
    if (report.milestones.profitability) achievements.push({ icon: '💰', text: 'Profitability Achieved' });
    if (report.milestones.seriesA) achievements.push({ icon: '📈', text: 'Series A Funded' });
    if (report.cofounder) achievements.push({ icon: '🤝', text: 'Partnership Maintained' });
    if (report.decisions.good > report.decisions.bad * 2) achievements.push({ icon: '🧠', text: 'Strategic Thinker' });
    if (report.monthsSurvived >= 24) achievements.push({ icon: '⏰', text: 'Long-term Survivor' });
    if (report.resources.users >= 10000) achievements.push({ icon: '👥', text: '10K+ Users' });
    if (report.resources.team >= 10) achievements.push({ icon: '👨‍💼', text: 'Team Builder' });
    
    return achievements.length > 0 ? achievements : [{ icon: '📝', text: 'Lesson Learned' }];
  }
  
  /**
   * Handle play again
   */
  handlePlayAgain() {
    location.reload();
  }
  
  /**
   * Handle share results
   */
  handleShareResults() {
    const report = this.game.getGameReport();
    const text = `I just played Startup Life! 🚀\n\n` +
      `${report.startupName} reached: ${report.finalStage}\n` +
      `Valuation: ${this.formatMoney(report.valuation)}\n` +
      `Score: ${report.score.toLocaleString()}\n` +
      `Good Decisions: ${report.decisions.goodPercentage}%\n\n` +
      `Can you do better? Play now!`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('📋 Results copied to clipboard!');
    }
  }
  
  /**
   * Utility: Format money
   */
  formatMoney(amount) {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  }
  
  /**
   * Utility: Format number
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  }
  
  /**
   * Utility: Get stage label
   */
  getStageLabel(stage) {
    const labels = {
      'idea': 'Idea Stage',
      'building': 'Building MVP',
      'launching': 'Launching Product',
      'growing': 'Growing Users',
      'scaling': 'Scaling Fast',
      'exit': 'Exit!'
    };
    return labels[stage] || stage;
  }
  
  /**
   * Utility: Get relationship label
   */
  getRelationshipLabel(relationship) {
    if (relationship >= 50) return '😊 Strong';
    if (relationship >= 20) return '😐 Neutral';
    if (relationship >= 0) return '😟 Weak';
    return '😡 Hostile';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameUI;
}

