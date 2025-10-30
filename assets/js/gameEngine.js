/**
 * Story-Driven Startup Game Engine
 * Manages resources, events, decisions, and gameplay progression
 */

class GameEngine {
  constructor() {
    // Game State
    this.gameStarted = false;
    this.gameEnded = false;
    this.month = 0;
    this.maxMonths = 36; // 3 years to exit
    
    // Player Info
    this.startupName = '';
    this.founderName = '';
    
    // Resources - Realistic brutal startup life
    this.resources = {
      money: 25000,        // Starting capital ($25K) - enough for 5-6 months
      team: 1,             // Just the founder
      product: 0,          // 0-100 product completion
      users: 0,            // User base
      revenue: 0,          // Monthly recurring revenue
      reputation: 30,      // 0-100 reputation score - nobody knows you
      morale: 60           // 0-100 team morale - starting anxious
    };
    
    // Co-founder
    this.cofounder = null;
    this.cofounderRelationship = 0; // -100 to +100
    
    // Progress Milestones
    this.milestones = {
      ideaValidated: false,
      mvpBuilt: false,
      firstUser: false,
      first100Users: false,
      firstRevenue: false,
      productMarketFit: false,
      profitability: false,
      seriesA: false,
      scaling: false,
      exit: false
    };
    
    // Decision History
    this.decisions = [];
    this.correctDecisions = 0;
    this.wrongDecisions = 0;
    
    // Current Stage
    this.stage = 'idea'; // idea, building, launching, growing, scaling, exit
    
    // Current Event
    this.currentEvent = null;
    this.eventHistory = [];
    this.shownEventIds = []; // Track which events have been shown to prevent repeats
    
    // Seeded RNG
    this.seed = Date.now();
    this.rng = this.seedRandom(this.seed);
  }
  
  /**
   * Seeded random number generator
   */
  seedRandom(seed) {
    let value = seed;
    return function() {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
  
  /**
   * Initialize a new game
   */
  startGame(startupName, founderName, seed = null) {
    this.startupName = startupName || 'My Startup';
    this.founderName = founderName || 'Founder';
    this.seed = seed || Date.now();
    this.rng = this.seedRandom(this.seed);
    
    this.gameStarted = true;
    this.gameEnded = false;
    this.month = 0;
    
    // Reset resources - Realistic brutal startup life
    this.resources = {
      money: 25000,      // $25K starting capital (5-6 months runway)
      team: 1,           // Just the founder
      product: 0,        // No product yet
      users: 0,          // No users yet
      revenue: 0,        // No revenue yet
      reputation: 30,    // Nobody knows you yet
      morale: 60         // Starting anxious
    };
    
    this.cofounder = null;
    this.cofounderRelationship = 0;
    
    // Reset event tracking
    this.shownEventIds = [];
    this.eventHistory = [];
    
    // Reset milestones
    Object.keys(this.milestones).forEach(key => {
      this.milestones[key] = false;
    });
    
    this.decisions = [];
    this.correctDecisions = 0;
    this.wrongDecisions = 0;
    this.stage = 'idea';
    this.eventHistory = [];
    
    // Generate first event
    this.generateEvent();
    
    return {
      success: true,
      message: `Welcome ${founderName}! Time to build ${startupName}!`
    };
  }
  
  /**
   * Generate a new event based on current stage and resources
   */
  generateEvent() {
    const availableEvents = this.getAvailableEvents();
    if (availableEvents.length === 0) {
      // No events available, auto-progress
      this.advanceMonth();
      return;
    }
    
    const eventIndex = Math.floor(this.rng() * availableEvents.length);
    this.currentEvent = availableEvents[eventIndex];
  }
  
  /**
   * Get events available for current game state
   */
  getAvailableEvents() {
    const stage = this.stage;
    const events = [];
    
    // Filter events by stage
    const stageEvents = STORY_EVENTS.filter(e => e.stage === stage || e.stage === 'any');
    
    // Check conditions and exclude already shown events
    stageEvents.forEach(event => {
      if (this.checkEventCondition(event) && !this.shownEventIds.includes(event.id)) {
        events.push(event);
      }
    });
    
    // If no new events available, reset shown events for this stage to allow repeats
    if (events.length === 0) {
      // Clear shown event IDs and try again
      const allStageEvents = stageEvents.filter(e => this.checkEventCondition(e));
      if (allStageEvents.length > 0) {
        // Only reset event IDs from current stage
        const currentStageEventIds = stageEvents.map(e => e.id);
        this.shownEventIds = this.shownEventIds.filter(id => !currentStageEventIds.includes(id));
        // Retry
        stageEvents.forEach(event => {
          if (this.checkEventCondition(event) && !this.shownEventIds.includes(event.id)) {
            events.push(event);
          }
        });
      }
    }
    
    return events;
  }
  
  /**
   * Check if event condition is met
   */
  checkEventCondition(event) {
    if (!event.condition) return true;
    
    const cond = event.condition;
    
    // Check resource conditions
    if (cond.money && this.resources.money < cond.money) return false;
    if (cond.team && this.resources.team < cond.team) return false;
    if (cond.product && this.resources.product < cond.product) return false;
    if (cond.users && this.resources.users < cond.users) return false;
    if (cond.revenue && this.resources.revenue < cond.revenue) return false;
    
    // Check milestone conditions
    if (cond.milestone && !this.milestones[cond.milestone]) return false;
    
    // Check cofounder conditions
    if (cond.hasCofounder && !this.cofounder) return false;
    if (cond.noCofounder && this.cofounder) return false;
    
    return true;
  }
  
  /**
   * Make a decision on current event
   */
  makeDecision(choiceIndex) {
    if (!this.currentEvent) return { success: false, message: 'No event active' };
    
    const choice = this.currentEvent.choices[choiceIndex];
    if (!choice) return { success: false, message: 'Invalid choice' };
    
    // Mark this event as shown
    if (!this.shownEventIds.includes(this.currentEvent.id)) {
      this.shownEventIds.push(this.currentEvent.id);
    }
    
    // Apply effects
    const effects = choice.effect;
    let narrative = choice.result;
    
    // Apply resource changes with proper bounds
    if (effects.money) this.resources.money += effects.money;
    if (effects.team) this.resources.team = Math.max(1, this.resources.team + effects.team); // Min 1 (founder)
    if (effects.product) this.resources.product = Math.max(0, Math.min(100, this.resources.product + effects.product));
    if (effects.users) this.resources.users = Math.max(0, this.resources.users + effects.users);
    if (effects.revenue) this.resources.revenue = Math.max(0, this.resources.revenue + effects.revenue);
    if (effects.reputation) this.resources.reputation = Math.max(0, Math.min(100, this.resources.reputation + effects.reputation));
    if (effects.morale) this.resources.morale = Math.max(0, Math.min(100, this.resources.morale + effects.morale));
    
    // Cofounder effects
    if (effects.getCofounder) {
      this.cofounder = {
        name: this.generateCofounderName(),
        skill: Math.floor(this.rng() * 30) + 70, // 70-100
        loyalty: 50
      };
      this.cofounderRelationship = 50;
      narrative += ` ${this.cofounder.name} joins as your co-founder!`;
    }
    
    if (effects.cofounderRelationship && this.cofounder) {
      this.cofounderRelationship += effects.cofounderRelationship;
      this.cofounder.loyalty = Math.max(0, Math.min(100, this.cofounder.loyalty + effects.cofounderRelationship));
      
      // Cofounder might leave if loyalty too low
      if (this.cofounder.loyalty < 20) {
        narrative += ` 💔 ${this.cofounder.name} has left the company due to irreconcilable differences.`;
        this.cofounder = null;
        this.cofounderRelationship = 0;
        this.resources.morale -= 20;
      }
    }
    
    // Check for exit game flag (acquisition accepted, etc.)
    if (choice.exitGame) {
      this.milestones.exit = true;
      this.gameEnded = true;
      this.stage = 'exit';
      
      // Record the exit decision
      this.decisions.push({
        month: this.month,
        event: this.currentEvent.title,
        choice: choice.text,
        quality: choice.quality,
        narrative: narrative
      });
      
      return { success: true, gameOver: true, reason: 'exit', narrative };
    }
    
    // Track decision quality
    if (choice.quality === 'good') {
      this.correctDecisions++;
    } else if (choice.quality === 'bad') {
      this.wrongDecisions++;
    }
    
    // Record decision
    this.decisions.push({
      month: this.month,
      event: this.currentEvent.title,
      choice: choice.text,
      quality: choice.quality,
      narrative: narrative
    });
    
    // Check for game over conditions
    if (this.resources.money <= 0) {
      this.gameOver('bankruptcy');
      return { success: true, gameOver: true, reason: 'bankruptcy', narrative };
    }
    
    if (this.resources.morale <= 0) {
      this.gameOver('morale');
      return { success: true, gameOver: true, reason: 'morale', narrative };
    }
    
    // Check milestones
    this.checkMilestones();
    
    // Update stage
    this.updateStage();
    
    // Add to event history
    this.eventHistory.push({
      month: this.month,
      event: this.currentEvent.title,
      choice: choice.text
    });
    
    // Advance to next month
    this.advanceMonth();
    
    // Generate next event
    this.generateEvent();
    
    return {
      success: true,
      narrative: narrative,
      resources: this.resources,
      gameOver: this.gameEnded
    };
  }
  
  /**
   * Advance game by one month
   */
  advanceMonth() {
    this.month++;
    
    // Monthly expenses - Realistic burn rate (brutal)
    const monthlyBurn = this.resources.team * 5000; // $5k per team member
    this.resources.money -= monthlyBurn;
    
    // Add monthly revenue
    this.resources.money += this.resources.revenue;
    
    // Natural user churn - startups lose users without effort
    if (this.resources.users > 0 && this.resources.product < 80) {
      const churnRate = 0.05; // 5% monthly churn if product not polished
      this.resources.users = Math.floor(this.resources.users * (1 - churnRate));
    }
    
    // Natural user growth is VERY slow - realistic
    if (this.resources.product > 70 && this.resources.users >= 50 && this.resources.reputation > 40) {
      const growthRate = this.resources.reputation / 500; // Very slow growth
      const growth = Math.floor(this.resources.users * growthRate);
      this.resources.users += Math.max(0, growth);
    }
    
    // Morale slowly decreases under pressure
    if (this.resources.money < 15000) { // Low on cash
      this.resources.morale = Math.max(0, this.resources.morale - 3);
    }
    
    // Ensure morale stays within bounds
    this.resources.morale = Math.max(0, Math.min(100, this.resources.morale));
    
    // Check if time limit reached
    if (this.month >= this.maxMonths && !this.milestones.exit) {
      this.gameOver('timeout');
    }
  }
  
  /**
   * Check and update milestones
   */
  checkMilestones() {
    if (this.resources.product >= 30 && !this.milestones.ideaValidated) {
      this.milestones.ideaValidated = true;
    }
    
    if (this.resources.product >= 70 && !this.milestones.mvpBuilt) {
      this.milestones.mvpBuilt = true;
    }
    
    if (this.resources.users >= 1 && !this.milestones.firstUser) {
      this.milestones.firstUser = true;
    }
    
    if (this.resources.users >= 100 && !this.milestones.first100Users) {
      this.milestones.first100Users = true;
    }
    
    if (this.resources.revenue > 0 && !this.milestones.firstRevenue) {
      this.milestones.firstRevenue = true;
    }
    
    if (this.resources.users >= 1000 && this.resources.revenue >= 5000 && !this.milestones.productMarketFit) {
      this.milestones.productMarketFit = true;
    }
    
    if (this.resources.revenue >= this.resources.team * 5000 && !this.milestones.profitability) {
      this.milestones.profitability = true;
    }
    
    if (this.resources.money >= 1000000 && this.milestones.productMarketFit && !this.milestones.seriesA) {
      this.milestones.seriesA = true;
    }
    
    if (this.resources.users >= 10000 && this.resources.revenue >= 50000 && !this.milestones.scaling) {
      this.milestones.scaling = true;
    }
  }
  
  /**
   * Update game stage based on progress
   */
  updateStage() {
    if (this.milestones.exit) {
      this.stage = 'exit';
    } else if (this.milestones.scaling) {
      this.stage = 'scaling';
    } else if (this.milestones.productMarketFit) {
      this.stage = 'growing';
    } else if (this.milestones.mvpBuilt) {
      this.stage = 'launching';
    } else if (this.resources.product > 20) {
      this.stage = 'building';
    } else {
      this.stage = 'idea';
    }
  }
  
  /**
   * Check if player can attempt exit - Much stricter (realistic)
   */
  canAttemptExit() {
    // Must have MVP built, 1000+ users, $10K+ MRR, and polished product
    return this.milestones.mvpBuilt && 
           this.resources.users >= 1000 && 
           this.resources.revenue >= 10000 &&
           this.resources.money > 0 &&
           this.resources.product >= 80;
  }
  
  /**
   * Attempt exit (acquisition or IPO) - Need $50M+ to be a real unicorn exit
   */
  attemptExit() {
    // Calculate company valuation
    const valuation = this.calculateValuation();
    
    if (valuation >= 50000000) { // $50M minimum for successful exit (realistic unicorn)
      this.milestones.exit = true;
      this.gameEnded = true;
      this.stage = 'exit';
      
      return {
        success: true,
        valuation: valuation,
        message: `🎉 Congratulations! Your company was acquired for $${(valuation / 1000000).toFixed(1)}M!`
      };
    } else if (valuation >= 10000000) {
      return {
        success: false,
        valuation: valuation,
        message: `Your company is valued at $${(valuation / 1000000).toFixed(1)}M. Acquirers want $50M+ for a serious exit. Keep growing!`
      };
    } else {
      return {
        success: false,
        valuation: valuation,
        message: `Your company is valued at $${(valuation / 1000000).toFixed(1)}M. Way too early. Need $50M+ to exit!`
      };
    }
  }
  
  /**
   * Calculate company valuation - Brutally realistic (99% fail)
   */
  calculateValuation() {
    // No users and no revenue? You're worth nothing.
    if (this.resources.users === 0 && this.resources.revenue === 0) {
      return 0;
    }
    
    // Early stage startups get 5-8x ARR, not 10-20x
    const revenueMultiple = this.resources.revenue * 12 * 6; // 6x ARR (realistic)
    
    // Users without revenue are almost worthless ($20 each, not $100)
    const userValue = this.resources.revenue === 0 
      ? this.resources.users * 20 
      : this.resources.users * 50; // Slightly better with revenue
    
    // Product quality matters a LOT - incomplete products tank valuation
    const productValue = this.resources.product >= 80 ? this.resources.product * 2000 : 0;
    
    // Reputation multiplier (0.5x to 1.5x) - bad rep kills you
    const reputationMultiplier = 0.5 + (this.resources.reputation / 100);
    
    // Morale multiplier - low morale = investors see red flags
    const moraleMultiplier = this.resources.morale < 50 
      ? 0.5 + (this.resources.morale / 100) 
      : 1.0;
    
    let baseValuation = (revenueMultiple + userValue + productValue) 
                        * reputationMultiplier 
                        * moraleMultiplier;
    
    // Minimum valuation only with REAL traction
    if (this.resources.users >= 500 && this.resources.revenue >= 5000 && this.resources.product >= 70) {
      baseValuation = Math.max(baseValuation, 200000); // Min $200K only if you have real traction
    }
    
    return Math.round(baseValuation);
  }
  
  /**
   * Game over
   */
  gameOver(reason) {
    this.gameEnded = true;
    this.gameOver = reason;
  }
  
  /**
   * Get progress percentage
   */
  getProgress() {
    const milestonesAchieved = Object.values(this.milestones).filter(m => m).length;
    const totalMilestones = Object.keys(this.milestones).length;
    return (milestonesAchieved / totalMilestones) * 100;
  }
  
  /**
   * Generate random cofounder name
   */
  generateCofounderName() {
    const names = ['Alex Chen', 'Jamie Rodriguez', 'Sam Patel', 'Morgan Lee', 'Jordan Taylor', 
                   'Casey Williams', 'Riley Johnson', 'Drew Anderson', 'Quinn Martinez', 'Avery Singh'];
    return names[Math.floor(this.rng() * names.length)];
  }
  
  /**
   * Get game report
   */
  getGameReport() {
    const totalDecisions = this.decisions.length;
    const goodDecisions = this.correctDecisions;
    const badDecisions = this.wrongDecisions;
    const neutralDecisions = totalDecisions - goodDecisions - badDecisions;
    
    const valuation = this.calculateValuation();
    const score = this.calculateScore();
    
    return {
      startupName: this.startupName,
      founderName: this.founderName,
      monthsSurvived: this.month,
      finalStage: this.stage,
      valuation: valuation,
      score: score,
      resources: { ...this.resources },
      milestones: { ...this.milestones },
      decisions: {
        total: totalDecisions,
        good: goodDecisions,
        bad: badDecisions,
        neutral: neutralDecisions,
        goodPercentage: totalDecisions > 0 ? (goodDecisions / totalDecisions * 100).toFixed(1) : 0,
        badPercentage: totalDecisions > 0 ? (badDecisions / totalDecisions * 100).toFixed(1) : 0
      },
      cofounder: this.cofounder,
      exitStatus: this.milestones.exit ? 'success' : 'failed'
    };
  }
  
  /**
   * Calculate final score
   */
  calculateScore() {
    let score = 0;
    
    // Valuation points
    score += this.calculateValuation() / 10000;
    
    // Milestone points
    score += Object.values(this.milestones).filter(m => m).length * 1000;
    
    // Decision quality points
    score += this.correctDecisions * 100;
    score -= this.wrongDecisions * 50;
    
    // Time bonus (faster exit = higher score)
    if (this.milestones.exit) {
      score += (this.maxMonths - this.month) * 100;
    }
    
    return Math.max(0, Math.floor(score));
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameEngine;
}

