/**
 * UI Controller
 * Handles user interactions, timeline rendering with D3, and UI state management
 */

class UIController {
  constructor(engine) {
    this.engine = engine;
    this.isPlaying = false;
    this.playInterval = null;
    this.tickSpeed = 1000; // ms per tick
    
    // Timeline SVG
    this.timelineSvg = null;
    this.timelineWidth = 0;
    this.timelineHeight = 100;
    
    // Message queue
    this.messageQueue = [];
    this.messageTimeout = null;
    
    // Callbacks
    this.onStateChange = null;
  }
  
  /**
   * Initialize UI elements
   */
  initialize() {
    this.setupButtons();
    this.setupTimeline();
    this.setupModals();
    this.updateUI();
  }
  
  /**
   * Setup button event listeners
   */
  setupButtons() {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.handleStart());
    }
    
    // Play/Pause button
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }
    
    // Step button
    const stepBtn = document.getElementById('step-btn');
    if (stepBtn) {
      stepBtn.addEventListener('click', () => this.handleStep());
    }
    
    // Action buttons
    document.getElementById('hire-btn')?.addEventListener('click', () => this.handleAction('hire'));
    document.getElementById('cut-costs-btn')?.addEventListener('click', () => this.handleAction('cutCosts'));
    document.getElementById('seek-funding-btn')?.addEventListener('click', () => this.handleAction('seekFunding'));
    document.getElementById('launch-btn')?.addEventListener('click', () => this.handleAction('launch'));
    document.getElementById('pivot-btn')?.addEventListener('click', () => this.handleAction('pivot'));
    
    // Export buttons
    document.getElementById('export-json-btn')?.addEventListener('click', () => this.exportJSON());
    document.getElementById('export-png-btn')?.addEventListener('click', () => this.exportPNG());
    
    // Auto-simulate button
    document.getElementById('auto-sim-btn')?.addEventListener('click', () => this.showAutoSimModal());
    
    // Speed control
    const speedSlider = document.getElementById('speed-slider');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.tickSpeed = 2000 - parseInt(e.target.value);
        document.getElementById('speed-value').textContent = e.target.value + '%';
        if (this.isPlaying) {
          this.stopPlay();
          this.startPlay();
        }
      });
    }
  }
  
  /**
   * Setup D3 timeline
   */
  setupTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    
    this.timelineWidth = container.clientWidth;
    
    // Remove existing SVG if any
    d3.select('#timeline-svg').remove();
    
    // Create SVG
    this.timelineSvg = d3.select('#timeline-container')
      .append('svg')
      .attr('id', 'timeline-svg')
      .attr('width', this.timelineWidth)
      .attr('height', this.timelineHeight);
    
    // Add axis
    this.timelineSvg.append('g')
      .attr('class', 'timeline-axis')
      .attr('transform', `translate(0, ${this.timelineHeight - 20})`);
  }
  
  /**
   * Update timeline visualization
   */
  updateTimeline() {
    if (!this.timelineSvg) return;
    
    const history = this.engine.history;
    if (history.length === 0) return;
    
    const margin = { left: 30, right: 30 };
    const width = this.timelineWidth - margin.left - margin.right;
    const height = this.timelineHeight - 30;
    
    // Scale
    const xScale = d3.scaleLinear()
      .domain([0, Math.max(history.length - 1, 10)])
      .range([margin.left, margin.left + width]);
    
    // Color scale
    const colorMap = {
      'Idea': '#c8c8dc',
      'Hype': '#ff3296',
      'Funding': '#ffd700',
      'Growth': '#32ff96',
      'Chaos': '#ff6432',
      'Pivot': '#9664ff',
      'Scale': '#64c8ff',
      'Exit': '#64ff64',
      'Debt': '#c83232',
      'Death': '#646464',
      'Rebirth': '#ffc864'
    };
    
    // Bind data
    const circles = this.timelineSvg.selectAll('circle.timeline-point')
      .data(history, d => d.tick);
    
    // Enter
    circles.enter()
      .append('circle')
      .attr('class', 'timeline-point')
      .attr('cx', (d, i) => xScale(i))
      .attr('cy', height / 2)
      .attr('r', 0)
      .attr('fill', d => colorMap[d.state] || '#ffffff')
      .attr('opacity', 0.8)
      .transition()
      .duration(300)
      .attr('r', 5);
    
    // Update
    circles
      .transition()
      .duration(300)
      .attr('cx', (d, i) => xScale(i))
      .attr('fill', d => colorMap[d.state] || '#ffffff');
    
    // Exit
    circles.exit()
      .transition()
      .duration(300)
      .attr('r', 0)
      .remove();
    
    // Add connecting lines
    const lines = this.timelineSvg.selectAll('line.timeline-connection')
      .data(history.slice(0, -1), d => d.tick);
    
    lines.enter()
      .append('line')
      .attr('class', 'timeline-connection')
      .attr('x1', (d, i) => xScale(i))
      .attr('y1', height / 2)
      .attr('x2', (d, i) => xScale(i + 1))
      .attr('y2', height / 2)
      .attr('stroke', '#555')
      .attr('stroke-width', 2)
      .attr('opacity', 0.5);
    
    lines
      .transition()
      .duration(300)
      .attr('x1', (d, i) => xScale(i))
      .attr('x2', (d, i) => xScale(i + 1));
    
    lines.exit().remove();
  }
  
  /**
   * Handle start button
   */
  handleStart() {
    const nameInput = document.getElementById('startup-name');
    const seedTypeSelect = document.getElementById('seed-type');
    
    const name = nameInput ? nameInput.value || 'My Startup' : 'My Startup';
    const seedType = seedTypeSelect ? seedTypeSelect.value : 'tech';
    
    this.engine.initialize(name, seedType);
    this.updateUI();
    this.updateTimeline();
    this.showMessage(`Started "${name}" as a ${this.engine.seedTypes[seedType].name}!`);
    
    if (this.onStateChange) {
      this.onStateChange(this.engine.currentState);
    }
    
    // Hide intro, show controls
    document.getElementById('intro-section')?.classList.add('hidden');
    document.getElementById('controls-section')?.classList.remove('hidden');
  }
  
  /**
   * Handle step button
   */
  handleStep() {
    const result = this.engine.executeTick();
    this.updateUI();
    this.updateTimeline();
    
    if (result.ended) {
      this.showMessage(result.reason);
      this.stopPlay();
    } else {
      this.showMessage(`Tick ${result.tick}: Transitioned to ${result.state}`);
    }
    
    if (this.onStateChange) {
      this.onStateChange(result.state);
    }
  }
  
  /**
   * Toggle play/pause
   */
  togglePlay() {
    if (this.isPlaying) {
      this.stopPlay();
    } else {
      this.startPlay();
    }
  }
  
  /**
   * Start auto-play
   */
  startPlay() {
    this.isPlaying = true;
    document.getElementById('play-btn').textContent = '⏸ Pause';
    
    this.playInterval = setInterval(() => {
      const result = this.engine.executeTick();
      this.updateUI();
      this.updateTimeline();
      
      if (result.ended) {
        this.showMessage(result.reason);
        this.stopPlay();
      }
      
      if (this.onStateChange) {
        this.onStateChange(result.state);
      }
    }, this.tickSpeed);
  }
  
  /**
   * Stop auto-play
   */
  stopPlay() {
    this.isPlaying = false;
    document.getElementById('play-btn').textContent = '▶ Play';
    
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }
  
  /**
   * Handle action buttons
   */
  handleAction(action) {
    let result;
    switch(action) {
      case 'hire':
        result = this.engine.actionHire();
        break;
      case 'cutCosts':
        result = this.engine.actionCutCosts();
        break;
      case 'seekFunding':
        result = this.engine.actionSeekFunding();
        break;
      case 'launch':
        result = this.engine.actionLaunch();
        break;
      case 'pivot':
        result = this.engine.actionPivot();
        break;
    }
    
    this.showMessage(result.message, result.success ? 'success' : 'error');
    this.updateUI();
    
    if (result.stateChanged && this.onStateChange) {
      this.onStateChange(this.engine.currentState);
      this.updateTimeline();
    }
  }
  
  /**
   * Update all UI elements
   */
  updateUI() {
    const info = this.engine.getStateInfo();
    
    // Update state display
    document.getElementById('current-state-display').textContent = info.currentState;
    document.getElementById('tick-display').textContent = info.tick;
    document.getElementById('startup-name-display').textContent = info.startupName;
    
    // Update modifiers display
    document.getElementById('hire-count').textContent = info.modifiers.hireCount;
    document.getElementById('burn-rate').textContent = info.modifiers.burnRate.toFixed(2);
    
    // Update action button states
    this.updateButtonState('hire-btn', info.canAct.hire, info.actionCooldowns.hire);
    this.updateButtonState('cut-costs-btn', info.canAct.cutCosts, info.actionCooldowns.cutCosts);
    this.updateButtonState('seek-funding-btn', info.canAct.seekFunding, info.actionCooldowns.seekFunding);
    this.updateButtonState('launch-btn', info.canAct.launch, info.actionCooldowns.launch);
    this.updateButtonState('pivot-btn', info.canAct.pivot, info.actionCooldowns.pivot);
    
    // Update stats
    if (this.engine.stats) {
      document.getElementById('total-ticks').textContent = this.engine.stats.totalTicks;
      document.getElementById('states-visited').textContent = Object.keys(this.engine.stats.statesVisited).length;
    }
  }
  
  /**
   * Update button enabled/disabled state
   */
  updateButtonState(buttonId, canAct, cooldown) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (canAct) {
      button.disabled = false;
      button.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      button.disabled = true;
      button.classList.add('opacity-50', 'cursor-not-allowed');
      if (cooldown > 0) {
        button.title = `Cooldown: ${cooldown} ticks`;
      }
    }
  }
  
  /**
   * Show message to user
   */
  showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message-display');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = 'message-display ' + type;
    messageEl.classList.remove('hidden');
    
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    
    this.messageTimeout = setTimeout(() => {
      messageEl.classList.add('hidden');
    }, 3000);
  }
  
  /**
   * Export as JSON
   */
  exportJSON() {
    const data = this.engine.exportJSON();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup-${this.engine.startupName.replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showMessage('Exported as JSON!');
  }
  
  /**
   * Export as PNG
   */
  exportPNG() {
    const canvas = document.getElementById('p5-canvas');
    if (!canvas) {
      this.showMessage('Canvas not found', 'error');
      return;
    }
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `startup-${this.engine.startupName.replace(/\s+/g, '-')}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      this.showMessage('Exported as PNG!');
    });
  }
  
  /**
   * Setup modals
   */
  setupModals() {
    // Auto-simulate modal
    const modal = document.getElementById('auto-sim-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const runBtn = document.getElementById('run-auto-sim-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal?.classList.add('hidden');
      });
    }
    
    if (runBtn) {
      runBtn.addEventListener('click', () => this.runAutoSimulation());
    }
  }
  
  /**
   * Show auto-simulation modal
   */
  showAutoSimModal() {
    document.getElementById('auto-sim-modal')?.classList.remove('hidden');
  }
  
  /**
   * Run auto-simulation
   */
  runAutoSimulation() {
    const numRuns = parseInt(document.getElementById('num-runs').value) || 10;
    const maxTicks = parseInt(document.getElementById('max-ticks').value) || 50;
    
    this.showMessage(`Running ${numRuns} simulations...`);
    document.getElementById('auto-sim-modal')?.classList.add('hidden');
    
    // Run simulations in background
    setTimeout(() => {
      const runs = this.engine.autoSimulate(numRuns, maxTicks);
      
      // Generate report
      const report = this.generateSimReport(runs);
      
      // Export report
      const json = JSON.stringify(report, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `auto-sim-${numRuns}-runs-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      this.showMessage(`Completed ${numRuns} simulations! Report exported.`);
      
      // Re-initialize the current startup
      this.handleStart();
    }, 100);
  }
  
  /**
   * Generate simulation report
   */
  generateSimReport(runs) {
    const finalStates = {};
    let totalTicks = 0;
    let successCount = 0;
    
    runs.forEach(run => {
      finalStates[run.finalState] = (finalStates[run.finalState] || 0) + 1;
      totalTicks += run.ticks;
      if (run.finalState === 'Exit') successCount++;
    });
    
    return {
      timestamp: new Date().toISOString(),
      numRuns: runs.length,
      seedType: this.engine.seedType,
      averageTicks: totalTicks / runs.length,
      successRate: (successCount / runs.length) * 100,
      finalStateDistribution: finalStates,
      runs: runs
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIController;
}

