# 🚀 The Startup Lifecycle

> **An interactive visual narrative of a startup's journey from Idea to Exit (or Death)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The Startup Lifecycle is an educational and artistic exploration of the chaotic journey of building a startup. Watch as your startup probabilistically transitions through various states based on your decisions and a bit of randomness. Will you reach a successful Exit, or will you face Death and potential Rebirth?

### 🎯 One-Liner Pitch

*"Experience the beautiful chaos of startup life through an interactive, probabilistic state machine with stunning visuals."*

## Features

- **11 Distinct States**: Idea, Hype, Funding, Growth, Chaos, Pivot, Scale, Exit, Debt, Death, Rebirth
- **Probabilistic Transitions**: Each state has weighted probabilities for transitioning to other states
- **User Actions**: Hire, Cut Costs, Seek Funding, Launch, and Pivot - each modifying transition probabilities
- **Stunning Visuals**: Each state has a unique visual representation with smooth morphing transitions (powered by p5.js)
- **Interactive Timeline**: See your startup's journey visualized over time (powered by D3.js)
- **Multiple Seed Types**: Tech, Consumer, or Biotech - each with different characteristics
- **Auto-Simulation**: Run hundreds of simulations to explore different outcomes
- **Export Options**: Download your journey as JSON or capture visuals as PNG
- **Keyboard Controls**: Full keyboard accessibility support
- **Shareable Snapshots**: Share your startup's current state on social media

## Quick Start

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AUTHOR_HANDLE/startup-lifecycle.git
   cd startup-lifecycle
   ```

2. **Serve the files:**
   
   You can use any static file server. Here are a few options:
   
   **Python 3:**
   ```bash
   python -m http.server 8000
   ```
   
   **Node.js (with http-server):**
   ```bash
   npx http-server -p 8000
   ```
   
   **PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000`

### No Build Step Required!

This project uses vanilla JavaScript and CDN-hosted libraries. Just serve the files and go!

## How to Play

1. **Enter your startup name** and choose a startup type (Tech, Consumer, or Biotech)
2. **Click "Spin a Startup"** to begin
3. **Use the Play button** to auto-advance or **Step** to go tick-by-tick
4. **Intervene with actions** to influence your startup's trajectory:
   - **Hire** (H): Increase growth potential, but raises burn rate
   - **Cut Costs** (C): Reduce burn rate, but may slow growth
   - **Seek Funding** (F): Boost funding probability, but risk chaos
   - **Launch** (L): Generate hype around your product
   - **Pivot** (P): Force an immediate pivot (use wisely!)

5. **Watch the timeline** to see your journey unfold
6. **Share or export** your results when done

## Customizing the Simulation

### Editing Transition Probabilities

The heart of the simulation is the `data/transitions.json` file. You can modify:

- **Transition probabilities** between states
- **Seed type modifiers** that affect different startup types
- **State names** and structure

#### Example transition entry:

```json
"Growth": {
  "Scale": 0.6,
  "Chaos": 0.3,
  "Pivot": 0.1
}
```

This means when in the **Growth** state:
- 60% chance to transition to **Scale**
- 30% chance to transition to **Chaos**
- 10% chance to transition to **Pivot**

**Important:** Probabilities should sum to 1.0 for each state.

### Adding New States

1. Add the state name to the `states` array in `transitions.json`
2. Define its transitions in the `transitions` object
3. Add visual representation in `assets/js/visualStages.js`:
   - Add color to `stateColors`
   - Add parameters to `stateParams`
   - Create a `drawYourState()` function
4. Update the switch statement in `renderStateVisual()`

## Architecture

```
startup-lifecycle/
├── index.html              # Main HTML with Tailwind CSS
├── README.md               # This file
├── LICENSE                 # MIT License
├── data/
│   ├── transitions.json    # State transition probabilities
│   └── presets.json        # Preset action sequences
└── assets/
    ├── js/
    │   ├── app.js          # Main app orchestrator
    │   ├── simEngine.js    # Simulation engine (state machine)
    │   ├── visualStages.js # p5.js visual representations
    │   └── ui.js           # UI controller and D3 timeline
    └── css/
        └── (none needed - Tailwind via CDN)
```

## Tech Stack

- **HTML5 + Tailwind CSS** - Modern, responsive UI
- **Vanilla JavaScript** - No frameworks, fast and simple
- **p5.js** - Creative visual representations
- **D3.js** - Interactive timeline visualization
- **Seeded RNG** - Reproducible simulations

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause simulation |
| `→` | Step forward one tick |
| `H` | Hire action |
| `C` | Cut Costs action |
| `F` | Seek Funding action |
| `L` | Launch action |
| `P` | Pivot action |

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch `main` and folder `/ (root)`
4. Your site will be available at `https://AUTHOR_HANDLE.github.io/startup-lifecycle/`

### Netlify/Vercel

Simply connect your GitHub repository and deploy. No build configuration needed!

## Auto-Simulation

Want to run statistical analysis? Use the Auto-Simulate feature:

1. Click **"Auto-Simulate"** button
2. Set number of runs (e.g., 100)
3. Set max ticks per run (e.g., 50)
4. Click **"Run"**
5. Download the JSON report with all simulation data

The report includes:
- Final state distribution
- Average survival time
- Success rate (Exit reached)
- Detailed step-by-step data for each run

## Educational Use

This project is perfect for:
- **Entrepreneurship courses** - Visualize startup dynamics
- **Game design classes** - Example of state machines and probability
- **Data visualization** - Demonstrates p5.js and D3.js integration
- **Interactive storytelling** - Narrative through simulation

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Accessibility

- Full keyboard navigation support
- Screen reader friendly
- Reduced motion support via `prefers-reduced-motion`
- High contrast visuals

## Contributing

Contributions are welcome! Ideas:
- New state types
- Additional actions
- More visual styles
- Sound effects
- Mobile-optimized controls

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

**Created by:** AUTHOR_HANDLE

**Inspiration:** The wild, unpredictable journey of every startup founder.

**Libraries:**
- [p5.js](https://p5js.org/) - Visual creativity
- [D3.js](https://d3js.org/) - Data-driven documents
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful styling

## Roadmap

- [ ] Add sound effects for state transitions
- [ ] Leaderboard (optional Firebase integration)
- [ ] More startup types (hardware, crypto, etc.)
- [ ] Historical company presets (follow real startup trajectories)
- [ ] Multiplayer mode (compete with friends)
- [ ] Mobile app version

---

**What would your startup become? Find out now! 🚀**

[Live Demo](https://AUTHOR_HANDLE.github.io/startup-lifecycle/) | [Report Bug](https://github.com/AUTHOR_HANDLE/startup-lifecycle/issues) | [Request Feature](https://github.com/AUTHOR_HANDLE/startup-lifecycle/issues)

