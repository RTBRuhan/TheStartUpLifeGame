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
    
    // Resources
    this.resources = {
      money: 50000,        // Starting capital ($50K)
      team: 1,             // Just the founder
      product: 0,          // 0-100 product completion
      users: 0,            // User base
      revenue: 0,          // Monthly recurring revenue
      reputation: 50,      // 0-100 reputation score
      morale: 75           // 0-100 team morale
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
    
    // Reset resources - More balanced starting point
    this.resources = {
      money: 50000,      // $50K starting capital (6-12 months runway)
      team: 1,           // Just the founder
      product: 0,        // No product yet
      users: 0,          // No users yet
      revenue: 0,        // No revenue yet
      reputation: 50,    // Neutral reputation
      morale: 75         // Good starting morale
    };
    
    this.cofounder = null;
    this.cofounderRelationship = 0;
    
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
    
    // Check conditions
    stageEvents.forEach(event => {
      if (this.checkEventCondition(event)) {
        events.push(event);
      }
    });
    
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
    
    // Apply effects
    const effects = choice.effect;
    let narrative = choice.result;
    
    // Apply resource changes
    if (effects.money) this.resources.money += effects.money;
    if (effects.team) this.resources.team += effects.team;
    if (effects.product) this.resources.product = Math.min(100, this.resources.product + effects.product);
    if (effects.users) this.resources.users += effects.users;
    if (effects.revenue) this.resources.revenue += effects.revenue;
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
    
    // Monthly expenses - More realistic burn rate
    const monthlyBurn = this.resources.team * 4000; // $4k per team member
    this.resources.money -= monthlyBurn;
    
    // Add monthly revenue
    this.resources.money += this.resources.revenue;
    
    // Natural user growth if product > 50 and you have some users
    if (this.resources.product > 50 && this.resources.users >= 10) {
      const growthRate = this.resources.reputation / 200; // Slower, more realistic growth
      const growth = Math.floor(this.resources.users * growthRate);
      this.resources.users += Math.max(1, growth); // At least 1 user growth if conditions met
    }
    
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
   * Check if player can attempt exit
   */
  canAttemptExit() {
    // Must have MVP built, users, and revenue to even attempt exit
    return this.milestones.mvpBuilt && 
           this.resources.users >= 100 && 
           this.resources.revenue > 0 &&
           this.resources.money > 0;
  }
  
  /**
   * Attempt exit (acquisition or IPO)
   */
  attemptExit() {
    // Calculate company valuation
    const valuation = this.calculateValuation();
    
    if (valuation >= 10000000) { // $10M minimum for exit
      this.milestones.exit = true;
      this.gameEnded = true;
      this.stage = 'exit';
      
      return {
        success: true,
        valuation: valuation,
        message: `🎉 Congratulations! Your company was acquired for $${(valuation / 1000000).toFixed(1)}M!`
      };
    } else {
      return {
        success: false,
        valuation: valuation,
        message: `Your company valuation is only $${(valuation / 1000000).toFixed(1)}M. Need $10M+ to exit!`
      };
    }
  }
  
  /**
   * Calculate company valuation
   */
  calculateValuation() {
    // Realistic valuation model
    const revenueMultiple = this.resources.revenue * 12 * 10; // 10x ARR
    const userValue = this.resources.users * 100; // $100 per user
    const productValue = this.resources.product >= 70 ? this.resources.product * 5000 : 0; // Product ready bonus
    
    // Reputation only matters if you have users/revenue
    const reputationMultiplier = (this.resources.users > 100 || this.resources.revenue > 0) 
      ? 1 + (this.resources.reputation / 100) 
      : 1;
    
    const baseValuation = (revenueMultiple + userValue + productValue) * reputationMultiplier;
    
    // Minimum valuation only if you have actual traction
    return this.resources.users > 0 || this.resources.revenue > 0 
      ? Math.max(baseValuation, 100000) // Min $100K if you have traction
      : baseValuation;
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

