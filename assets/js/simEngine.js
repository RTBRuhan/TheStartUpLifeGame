/**
 * Simulation Engine
 * Handles the state machine logic, probability calculations, and state transitions
 */

class SimulationEngine {
  constructor(transitionsData) {
    this.states = transitionsData.states;
    this.baseTransitions = transitionsData.transitions;
    this.seedTypes = transitionsData.seedTypes;
    
    // Current simulation state
    this.currentState = 'Idea';
    this.startupName = '';
    this.seedType = 'tech';
    this.history = [];
    this.tick = 0;
    this.isRunning = false;
    this.seed = Date.now();
    
    // Modifiers from user actions
    this.modifiers = {
      hireCount: 0,
      burnRate: 1.0,
      fundingBoost: 0,
      hypeBoost: 0,
      pivotCooldown: 0
    };
    
    // Action cooldowns
    this.actionCooldowns = {
      hire: 0,
      cutCosts: 0,
      seekFunding: 0,
      launch: 0,
      pivot: 0
    };
    
    // Seeded random number generator
    this.rng = this.seedRandom(this.seed);
    
    // Statistics
    this.stats = {
      totalTicks: 0,
      statesVisited: {},
      actionsPerformed: {}
    };
  }
  
  /**
   * Seeded random number generator for reproducibility
   */
  seedRandom(seed) {
    let value = seed;
    return function() {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
  
  /**
   * Initialize a new startup
   */
  initialize(startupName, seedType, seed = null) {
    this.startupName = startupName || 'My Startup';
    this.seedType = seedType || 'tech';
    this.seed = seed || Date.now();
    this.rng = this.seedRandom(this.seed);
    
    this.currentState = 'Idea';
    this.history = [{
      tick: 0,
      state: 'Idea',
      timestamp: Date.now(),
      modifiers: { ...this.modifiers }
    }];
    this.tick = 0;
    this.isRunning = false;
    
    // Reset modifiers
    this.modifiers = {
      hireCount: 0,
      burnRate: 1.0,
      fundingBoost: 0,
      hypeBoost: 0,
      pivotCooldown: 0
    };
    
    // Reset cooldowns
    Object.keys(this.actionCooldowns).forEach(key => {
      this.actionCooldowns[key] = 0;
    });
    
    // Reset stats
    this.stats = {
      totalTicks: 0,
      statesVisited: { 'Idea': 1 },
      actionsPerformed: {}
    };
  }
  
  /**
   * Get modified transition probabilities based on current modifiers
   */
  getModifiedProbabilities() {
    const baseProbs = this.baseTransitions[this.currentState];
    if (!baseProbs) return null;
    
    // Clone probabilities
    let probs = { ...baseProbs };
    
    // Apply seed type modifiers
    const seedModifiers = this.seedTypes[this.seedType].modifiers;
    Object.keys(probs).forEach(targetState => {
      if (seedModifiers[targetState]) {
        probs[targetState] *= seedModifiers[targetState];
      }
    });
    
    // Apply user action modifiers
    if (this.modifiers.hireCount > 0) {
      if (probs['Growth']) probs['Growth'] += 0.05 * this.modifiers.hireCount;
      if (probs['Chaos']) probs['Chaos'] += 0.02 * this.modifiers.hireCount;
    }
    
    if (this.modifiers.burnRate < 1.0) {
      // Cutting costs increases survival
      if (probs['Death']) probs['Death'] *= this.modifiers.burnRate;
      if (probs['Growth']) probs['Growth'] *= 0.9;
    }
    
    if (this.modifiers.fundingBoost > 0) {
      if (probs['Funding']) probs['Funding'] += this.modifiers.fundingBoost;
      if (probs['Chaos']) probs['Chaos'] += this.modifiers.fundingBoost * 0.5;
      this.modifiers.fundingBoost *= 0.5; // Decay
    }
    
    if (this.modifiers.hypeBoost > 0) {
      if (probs['Hype']) probs['Hype'] += this.modifiers.hypeBoost;
      if (probs['Growth']) probs['Growth'] += this.modifiers.hypeBoost * 0.3;
      this.modifiers.hypeBoost *= 0.7; // Decay
    }
    
    // Normalize probabilities to sum to 1
    const sum = Object.values(probs).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      Object.keys(probs).forEach(key => {
        probs[key] /= sum;
      });
    }
    
    return probs;
  }
  
  /**
   * Sample a state based on probability distribution
   */
  sampleByProbability(probs) {
    const rand = this.rng();
    let cumulative = 0;
    
    for (const [state, prob] of Object.entries(probs)) {
      cumulative += prob;
      if (rand <= cumulative) {
        return state;
      }
    }
    
    // Fallback to first state
    return Object.keys(probs)[0];
  }
  
  /**
   * Execute one simulation tick
   */
  executeTick() {
    if (this.currentState === 'Exit') {
      this.isRunning = false;
      return { state: 'Exit', ended: true, reason: 'Success! Exit achieved.' };
    }
    
    // Decay cooldowns
    Object.keys(this.actionCooldowns).forEach(key => {
      if (this.actionCooldowns[key] > 0) this.actionCooldowns[key]--;
    });
    
    if (this.modifiers.pivotCooldown > 0) this.modifiers.pivotCooldown--;
    
    // Get modified probabilities
    const probs = this.getModifiedProbabilities();
    if (!probs) {
      this.isRunning = false;
      return { state: this.currentState, ended: true, reason: 'No transitions available.' };
    }
    
    // Sample next state
    const nextState = this.sampleByProbability(probs);
    
    // Update state
    this.currentState = nextState;
    this.tick++;
    this.stats.totalTicks++;
    
    // Record history
    this.history.push({
      tick: this.tick,
      state: nextState,
      timestamp: Date.now(),
      modifiers: { ...this.modifiers }
    });
    
    // Update stats
    this.stats.statesVisited[nextState] = (this.stats.statesVisited[nextState] || 0) + 1;
    
    return {
      state: nextState,
      ended: false,
      tick: this.tick,
      probs: probs
    };
  }
  
  /**
   * User action: Hire
   */
  actionHire() {
    if (this.actionCooldowns.hire > 0) {
      return { success: false, message: 'Hire action on cooldown' };
    }
    
    this.modifiers.hireCount++;
    this.modifiers.burnRate += 0.1;
    this.actionCooldowns.hire = 3;
    this.stats.actionsPerformed['Hire'] = (this.stats.actionsPerformed['Hire'] || 0) + 1;
    
    return { success: true, message: 'Hired! Growth potential increased, but burn rate is higher.' };
  }
  
  /**
   * User action: Cut Costs
   */
  actionCutCosts() {
    if (this.actionCooldowns.cutCosts > 0) {
      return { success: false, message: 'Cut Costs action on cooldown' };
    }
    
    this.modifiers.burnRate = Math.max(0.5, this.modifiers.burnRate - 0.15);
    if (this.modifiers.hireCount > 0) this.modifiers.hireCount--;
    this.actionCooldowns.cutCosts = 3;
    this.stats.actionsPerformed['Cut Costs'] = (this.stats.actionsPerformed['Cut Costs'] || 0) + 1;
    
    return { success: true, message: 'Costs cut! Burn rate reduced, but growth may slow.' };
  }
  
  /**
   * User action: Seek Funding
   */
  actionSeekFunding() {
    if (this.actionCooldowns.seekFunding > 0) {
      return { success: false, message: 'Seek Funding action on cooldown' };
    }
    
    this.modifiers.fundingBoost += 0.15;
    this.actionCooldowns.seekFunding = 5;
    this.stats.actionsPerformed['Seek Funding'] = (this.stats.actionsPerformed['Seek Funding'] || 0) + 1;
    
    return { success: true, message: 'Seeking funding! Funding probability increased, but chaos risk higher.' };
  }
  
  /**
   * User action: Launch
   */
  actionLaunch() {
    if (this.actionCooldowns.launch > 0) {
      return { success: false, message: 'Launch action on cooldown' };
    }
    
    this.modifiers.hypeBoost += 0.2;
    this.actionCooldowns.launch = 4;
    this.stats.actionsPerformed['Launch'] = (this.stats.actionsPerformed['Launch'] || 0) + 1;
    
    return { success: true, message: 'Launched! Hype is building!' };
  }
  
  /**
   * User action: Pivot
   */
  actionPivot() {
    if (this.actionCooldowns.pivot > 0) {
      return { success: false, message: 'Pivot action on cooldown' };
    }
    
    if (this.currentState === 'Pivot' || this.currentState === 'Exit') {
      return { success: false, message: 'Cannot pivot from this state' };
    }
    
    // Force transition to Pivot state
    this.currentState = 'Pivot';
    this.tick++;
    this.history.push({
      tick: this.tick,
      state: 'Pivot',
      timestamp: Date.now(),
      modifiers: { ...this.modifiers },
      forced: true
    });
    
    this.actionCooldowns.pivot = 10;
    this.modifiers.pivotCooldown = 10;
    this.stats.actionsPerformed['Pivot'] = (this.stats.actionsPerformed['Pivot'] || 0) + 1;
    this.stats.statesVisited['Pivot'] = (this.stats.statesVisited['Pivot'] || 0) + 1;
    
    return { success: true, message: 'Pivoting! New direction chosen.', stateChanged: true };
  }
  
  /**
   * Auto-simulate N runs and collect data
   */
  autoSimulate(numRuns, maxTicksPerRun = 50) {
    const runs = [];
    
    for (let i = 0; i < numRuns; i++) {
      const runSeed = this.seed + i;
      this.initialize(this.startupName, this.seedType, runSeed);
      
      while (this.tick < maxTicksPerRun && this.currentState !== 'Exit') {
        const result = this.executeTick();
        if (result.ended) break;
      }
      
      runs.push({
        runId: i,
        seed: runSeed,
        seedType: this.seedType,
        finalState: this.currentState,
        ticks: this.tick,
        steps: [...this.history]
      });
    }
    
    return runs;
  }
  
  /**
   * Export current run as JSON
   */
  exportJSON() {
    return {
      startupName: this.startupName,
      seedType: this.seedType,
      seed: this.seed,
      finalState: this.currentState,
      totalTicks: this.tick,
      history: this.history,
      stats: this.stats,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Get current state info
   */
  getStateInfo() {
    return {
      currentState: this.currentState,
      tick: this.tick,
      startupName: this.startupName,
      seedType: this.seedType,
      modifiers: this.modifiers,
      actionCooldowns: this.actionCooldowns,
      canAct: {
        hire: this.actionCooldowns.hire === 0,
        cutCosts: this.actionCooldowns.cutCosts === 0,
        seekFunding: this.actionCooldowns.seekFunding === 0,
        launch: this.actionCooldowns.launch === 0,
        pivot: this.actionCooldowns.pivot === 0 && this.currentState !== 'Pivot' && this.currentState !== 'Exit'
      }
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimulationEngine;
}

