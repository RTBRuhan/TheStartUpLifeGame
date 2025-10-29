/**
 * Visual Stages
 * p5.js-based visual representations for each startup lifecycle state
 */

class VisualStages {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.currentState = 'Idea';
    this.targetState = 'Idea';
    this.transitionProgress = 1.0;
    this.transitionDuration = 60; // frames
    
    // Particle systems for each state
    this.particles = [];
    this.maxParticles = 100;
    
    // Animation parameters
    this.time = 0;
    this.pulsePhase = 0;
    
    // State colors (RGB)
    this.stateColors = {
      'Idea': [200, 200, 220],
      'Hype': [255, 50, 150],
      'Funding': [255, 215, 0],
      'Growth': [50, 255, 150],
      'Chaos': [255, 100, 50],
      'Pivot': [150, 100, 255],
      'Scale': [100, 200, 255],
      'Exit': [100, 255, 100],
      'Debt': [200, 50, 50],
      'Death': [100, 100, 100],
      'Rebirth': [255, 200, 100]
    };
    
    // State visual parameters
    this.stateParams = {
      'Idea': { particleSpeed: 0.5, particleCount: 20, shape: 'circle', size: 30 },
      'Hype': { particleSpeed: 5, particleCount: 80, shape: 'confetti', size: 10 },
      'Funding': { particleSpeed: 2, particleCount: 40, shape: 'ring', size: 50 },
      'Growth': { particleSpeed: 3, particleCount: 60, shape: 'network', size: 40 },
      'Chaos': { particleSpeed: 8, particleCount: 70, shape: 'jagged', size: 25 },
      'Pivot': { particleSpeed: 2, particleCount: 30, shape: 'morph', size: 45 },
      'Scale': { particleSpeed: 4, particleCount: 50, shape: 'grid', size: 35 },
      'Exit': { particleSpeed: 1, particleCount: 100, shape: 'star', size: 60 },
      'Debt': { particleSpeed: 1.5, particleCount: 40, shape: 'chain', size: 30 },
      'Death': { particleSpeed: 0.3, particleCount: 20, shape: 'fade', size: 20 },
      'Rebirth': { particleSpeed: 3, particleCount: 50, shape: 'spiral', size: 40 }
    };
  }
  
  /**
   * Transition to a new state
   */
  transitionTo(newState) {
    if (this.currentState !== newState) {
      this.targetState = newState;
      this.transitionProgress = 0;
    }
  }
  
  /**
   * Update and render the current visual state
   */
  render() {
    const p = this.p;
    this.time++;
    
    // Clear background
    p.background(20, 20, 30);
    
    // Update transition
    if (this.transitionProgress < 1.0) {
      this.transitionProgress += 1.0 / this.transitionDuration;
      if (this.transitionProgress >= 1.0) {
        this.transitionProgress = 1.0;
        this.currentState = this.targetState;
      }
    }
    
    // Get interpolated colors and params
    const currentColor = this.stateColors[this.currentState];
    const targetColor = this.stateColors[this.targetState];
    const currentParams = this.stateParams[this.currentState];
    const targetParams = this.stateParams[this.targetState];
    
    // Ease function (cubic ease in-out)
    const easeProgress = this.easeInOutCubic(this.transitionProgress);
    
    // Interpolate color
    const r = this.lerp(currentColor[0], targetColor[0], easeProgress);
    const g = this.lerp(currentColor[1], targetColor[1], easeProgress);
    const b = this.lerp(currentColor[2], targetColor[2], easeProgress);
    
    // Interpolate parameters
    const particleSpeed = this.lerp(currentParams.particleSpeed, targetParams.particleSpeed, easeProgress);
    const particleCount = Math.floor(this.lerp(currentParams.particleCount, targetParams.particleCount, easeProgress));
    const size = this.lerp(currentParams.size, targetParams.size, easeProgress);
    
    // Update particles
    this.updateParticles(particleCount, particleSpeed);
    
    // Render based on current state
    p.push();
    p.translate(p.width / 2, p.height / 2);
    
    // Main visual
    this.renderStateVisual(this.currentState, [r, g, b], size, easeProgress);
    
    // Render particles
    this.renderParticles([r, g, b]);
    
    p.pop();
    
    // State name overlay
    this.renderStateName(this.targetState, [r, g, b]);
  }
  
  /**
   * Render the specific visual for each state
   */
  renderStateVisual(state, color, size, progress) {
    const p = this.p;
    p.noFill();
    p.strokeWeight(3);
    p.stroke(color[0], color[1], color[2], 150);
    
    switch(state) {
      case 'Idea':
        this.drawIdea(size, color);
        break;
      case 'Hype':
        this.drawHype(size, color);
        break;
      case 'Funding':
        this.drawFunding(size, color);
        break;
      case 'Growth':
        this.drawGrowth(size, color);
        break;
      case 'Chaos':
        this.drawChaos(size, color);
        break;
      case 'Pivot':
        this.drawPivot(size, color);
        break;
      case 'Scale':
        this.drawScale(size, color);
        break;
      case 'Exit':
        this.drawExit(size, color);
        break;
      case 'Debt':
        this.drawDebt(size, color);
        break;
      case 'Death':
        this.drawDeath(size, color);
        break;
      case 'Rebirth':
        this.drawRebirth(size, color);
        break;
    }
  }
  
  // State-specific drawing functions
  
  drawIdea(size, color) {
    const p = this.p;
    const pulse = 1 + Math.sin(this.time * 0.02) * 0.1;
    p.circle(0, 0, size * pulse);
    p.circle(0, 0, size * 0.5 * pulse);
  }
  
  drawHype(size, color) {
    const p = this.p;
    p.strokeWeight(4);
    for (let i = 0; i < 8; i++) {
      const angle = (this.time * 0.05 + i * Math.PI / 4);
      const r = size + Math.sin(this.time * 0.1 + i) * 20;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      p.line(0, 0, x, y);
    }
  }
  
  drawFunding(size, color) {
    const p = this.p;
    for (let i = 0; i < 5; i++) {
      const expand = this.time * 2 + i * 30;
      const alpha = 255 - (expand % 150);
      p.stroke(color[0], color[1], color[2], alpha);
      p.circle(0, 0, (expand % 150) + size);
    }
  }
  
  drawGrowth(size, color) {
    const p = this.p;
    const nodes = 8;
    p.strokeWeight(2);
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2;
      const r = size;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      p.line(0, 0, x, y);
      p.circle(x, y, 10);
      
      // Connect to neighbors
      const nextAngle = ((i + 1) / nodes) * Math.PI * 2;
      const nextX = Math.cos(nextAngle) * r;
      const nextY = Math.sin(nextAngle) * r;
      p.line(x, y, nextX, nextY);
    }
  }
  
  drawChaos(size, color) {
    const p = this.p;
    p.strokeWeight(3);
    p.beginShape();
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + this.time * 0.03;
      const r = size + Math.random() * 30;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }
  
  drawPivot(size, color) {
    const p = this.p;
    const rotation = this.time * 0.03;
    p.push();
    p.rotate(rotation);
    p.rectMode(p.CENTER);
    p.rect(0, 0, size, size);
    p.rotate(Math.PI / 4);
    p.rect(0, 0, size * 0.7, size * 0.7);
    p.pop();
  }
  
  drawScale(size, color) {
    const p = this.p;
    const gridSize = 4;
    const spacing = size / 2;
    p.strokeWeight(2);
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        const pulse = Math.sin(this.time * 0.05 + i + j) * 5;
        p.circle(i * spacing, j * spacing, 8 + pulse);
      }
    }
  }
  
  drawExit(size, color) {
    const p = this.p;
    p.strokeWeight(4);
    const points = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    p.beginShape();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    
    // Glow effect
    p.fill(color[0], color[1], color[2], 30);
    p.noStroke();
    p.circle(0, 0, size * 2);
  }
  
  drawDebt(size, color) {
    const p = this.p;
    p.strokeWeight(3);
    const links = 6;
    for (let i = 0; i < links; i++) {
      const y = -size + (i * size / 3);
      const sway = Math.sin(this.time * 0.05 + i) * 10;
      p.line(sway, y, sway, y + size / 4);
      p.circle(sway, y, 15);
    }
  }
  
  drawDeath(size, color) {
    const p = this.p;
    const fade = Math.max(0.3, Math.sin(this.time * 0.02));
    p.stroke(color[0], color[1], color[2], 150 * fade);
    p.strokeWeight(2);
    p.circle(0, 0, size * fade);
    p.line(-size * 0.5, 0, size * 0.5, 0);
  }
  
  drawRebirth(size, color) {
    const p = this.p;
    p.strokeWeight(2);
    const spirals = 3;
    for (let s = 0; s < spirals; s++) {
      p.beginShape();
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 4 + this.time * 0.02 + s * Math.PI * 2 / spirals;
        const r = (i / 50) * size;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        p.vertex(x, y);
      }
      p.endShape();
    }
  }
  
  /**
   * Update particle system
   */
  updateParticles(targetCount, speed) {
    // Add or remove particles to match target count
    while (this.particles.length < targetCount) {
      this.particles.push(this.createParticle());
    }
    while (this.particles.length > targetCount) {
      this.particles.pop();
    }
    
    // Update each particle
    this.particles.forEach(particle => {
      particle.angle += particle.speed * speed * 0.01;
      particle.radius += particle.radiusSpeed * speed * 0.1;
      particle.life--;
      
      if (particle.life <= 0 || particle.radius > 300) {
        this.resetParticle(particle);
      }
    });
  }
  
  /**
   * Create a new particle
   */
  createParticle() {
    return {
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 50,
      speed: (Math.random() - 0.5) * 2,
      radiusSpeed: Math.random() * 2 - 1,
      size: Math.random() * 5 + 2,
      life: Math.floor(Math.random() * 100) + 50
    };
  }
  
  /**
   * Reset a particle
   */
  resetParticle(particle) {
    particle.angle = Math.random() * Math.PI * 2;
    particle.radius = Math.random() * 50;
    particle.speed = (Math.random() - 0.5) * 2;
    particle.radiusSpeed = Math.random() * 2 - 1;
    particle.life = Math.floor(Math.random() * 100) + 50;
  }
  
  /**
   * Render all particles
   */
  renderParticles(color) {
    const p = this.p;
    p.noStroke();
    
    this.particles.forEach(particle => {
      const x = Math.cos(particle.angle) * particle.radius;
      const y = Math.sin(particle.angle) * particle.radius;
      const alpha = (particle.life / 150) * 150;
      
      p.fill(color[0], color[1], color[2], alpha);
      p.circle(x, y, particle.size);
    });
  }
  
  /**
   * Render state name
   */
  renderStateName(state, color) {
    const p = this.p;
    p.push();
    p.fill(color[0], color[1], color[2]);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(32);
    p.textStyle(p.BOLD);
    p.text(state, p.width / 2, p.height - 40);
    p.pop();
  }
  
  /**
   * Utility: Linear interpolation
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }
  
  /**
   * Utility: Cubic ease in-out
   */
  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisualStages;
}

