# 🚀 Startup Life - The Game

> **A story-driven startup simulation game where every decision matters**

Build your startup from a garage idea to a billion-dollar exit. Navigate crises, manage relationships, make critical decisions, and see if you have what it takes to succeed in the startup world.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎮 Game Features

### Story-Driven Gameplay
- **30+ Unique Events** - Each with multiple decision paths and consequences
- **Dynamic Narrative** - Your choices shape the story and determine outcomes
- **Multiple Endings** - Success, failure, acquisition, or burn out

### Resource Management
- **💰 Money** - Manage cash flow and runway
- **👥 Team** - Build and maintain your workforce
- **🛠️ Product** - Develop from idea to market-ready product
- **👤 Users** - Grow your user base organically or through marketing
- **💵 Revenue** - Generate sustainable income
- **⭐ Reputation** - Build trust in your market
- **😊 Morale** - Keep your team motivated

### Co-founder System
- **Find Partners** - Get a co-founder through gameplay events
- **Relationship Dynamics** - Maintain good relationships or face consequences
- **Partner Loyalty** - Make decisions that affect your co-founder's loyalty
- **Potential Betrayal** - They might leave if treated poorly or get better offers

### Progress Tracking
- **Visual Progress Bar** - See your journey from idea to exit
- **9 Milestones** - Track key achievements:
  - ✅ Idea Validated
  - ✅ MVP Built
  - ✅ First User
  - ✅ First Revenue
  - ✅ Product-Market Fit
  - ✅ Profitability
  - ✅ Series A Funding
  - ✅ Scaling
  - ✅ Exit

### Decision Quality Tracking
- **✅ Good Decisions** - Smart choices that benefit your startup
- **❌ Bad Decisions** - Risky or poor choices with consequences
- **➖ Neutral Decisions** - Balanced trade-offs

### End-Game Report
- **Company Valuation** - See how much your company is worth
- **Final Score** - Comprehensive scoring based on multiple factors
- **Decision Analysis** - Percentage of good vs. bad decisions
- **Achievement System** - Unlock achievements based on your journey
- **Shareable Results** - Share your success (or failure) story

## 🎯 How to Play

### Getting Started

1. **Clone & Serve**
   ```bash
   git clone https://github.com/AUTHOR_HANDLE/startup-lifecycle.git
   cd startup-lifecycle
   python -m http.server 8000
   ```

2. **Open in Browser**
   Navigate to `http://localhost:8000`

3. **Enter Your Details**
   - Your name (Founder name)
   - Your startup name

4. **Start Playing!**

### Gameplay

1. **Read the Event** - Each event presents a scenario from startup life
2. **Choose Wisely** - Select from 2-3 options, each with different consequences
3. **Watch Resources** - Monitor your resources in the sidebar
4. **Track Progress** - Follow your progress toward exit at the top
5. **Make Decisions** - Use mouse clicks or keyboard numbers (1, 2, 3)

### Winning Strategies

- **Balance Resources** - Don't ignore any resource completely
- **Build Relationships** - Treat your co-founder well
- **Take Smart Risks** - Some risks pay off, but choose wisely
- **Watch Your Runway** - Don't run out of money
- **Keep Morale High** - Low morale leads to disasters
- **Time Matters** - You have 36 months to reach exit

## 📊 Game Stages

1. **Idea Stage** (0-20% product)
   - Validate your idea
   - Find co-founders
   - Make initial decisions

2. **Building MVP** (20-70% product)
   - Choose tech stack
   - Build your product
   - Manage burnout

3. **Launching** (70%+ product, < 1000 users)
   - Launch strategy
   - Deal with bugs
   - Get first users

4. **Growing** (1000+ users)
   - Monetization decisions
   - Scale infrastructure
   - Handle growth pains

5. **Scaling** (Product-Market Fit achieved)
   - Raise funding
   - Expand internationally
   - Consider acquisition offers

6. **Exit** 🎉
   - Successfully exit with valuation > $10M
   - See your final score and achievements

## 🎲 Event Types

### Positive Events
- Partnership opportunities
- Press coverage
- Investor interest
- Growth milestones

### Challenges
- Technical problems
- Competitor threats
- Running out of money
- Co-founder conflicts
- Team burnout

### Critical Decisions
- Quit job or bootstrap?
- Raise money or stay independent?
- Hire fast or slow?
- Accept acquisition or keep growing?

## 💡 Decision Hints

Each choice shows hints about its effects:
- 💰 Money changes
- 👥 Team size
- 🛠️ Product progress
- ⭐ Reputation impact
- 😊 Morale changes

## 🏆 Scoring System

Your final score is based on:
- **Valuation** - Higher is better
- **Milestones Achieved** - Each worth 1000 points
- **Decision Quality** - Good decisions: +100, Bad: -50
- **Speed Bonus** - Faster exit = higher score
- **Survival** - Making it to exit adds significant points

## 🎪 Special Features

### Quick Actions
- **🎯 Attempt Exit** - Try to exit if valuation is high enough
- **💾 Save Progress** - Save your game to continue later

### Keyboard Shortcuts
- **1, 2, 3** - Make decisions quickly
- **Esc** - (Future: Pause menu)

### Shareable Results
After the game ends, share your results:
- Copy to clipboard
- Share on social media
- Challenge friends to beat your score

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🛠️ Technical Architecture

### File Structure
```
startup-lifecycle/
├── index.html              # Main game interface
├── README.md               # This file
├── assets/
│   └── js/
│       ├── gameEngine.js   # Core game logic & state management
│       ├── storyEvents.js  # 30+ narrative events database
│       ├── gameUI.js       # UI controller & animations
│       └── gameApp.js      # Main orchestrator
└── data/
    └── (no longer needed)
```

### Tech Stack
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **Vanilla JavaScript** - No frameworks, pure performance
- **LocalStorage** - Save game functionality

### Key Classes

**GameEngine** - Manages:
- Resource tracking
- State transitions
- Event generation
- Decision processing
- Milestone checking
- Co-founder relationships
- Game over conditions

**GameUI** - Handles:
- Screen transitions
- Resource visualization
- Event rendering
- Decision buttons
- Progress bar
- End-game report

## 🎨 Design Philosophy

### Minimal Black & White Aesthetic
- Pure black background (#000000)
- White text and accents
- Grayscale resource bars
- Clean, focused interface

### Story First
- Narrative-driven events
- Meaningful choices
- Real startup scenarios
- Educational value

### Accessibility
- Keyboard navigation
- Clear visual hierarchy
- High contrast design
- Reduced motion support

## 🔧 Customization

### Adding New Events

Edit `assets/js/storyEvents.js`:

```javascript
{
  id: 'your_event_id',
  stage: 'growing',  // or 'idea', 'building', 'launching', 'scaling', 'any'
  title: 'Your Event Title',
  description: 'What happens in this event...',
  condition: {  // Optional
    users: 1000,  // Requires 1000+ users
    hasCofounder: true  // Requires co-founder
  },
  choices: [
    {
      text: 'Option 1',
      quality: 'good',  // or 'bad', 'neutral'
      effect: {
        money: +10000,
        reputation: +10,
        users: +500
      },
      result: 'What happens after choosing this...'
    },
    // ... more choices
  ]
}
```

### Tuning Game Balance

In `gameEngine.js`, adjust:
- Starting resources
- Monthly burn rate
- Milestone thresholds
- Time limit (36 months default)
- Scoring weights

## 📚 Learning Outcomes

Players will learn about:
- **Startup Stages** - From idea to exit
- **Resource Management** - Balancing multiple constraints
- **Decision Making** - Risk vs. reward trade-offs
- **Team Dynamics** - Importance of relationships
- **Market Strategy** - Timing and positioning
- **Financial Planning** - Runway and burn rate
- **Product Development** - MVP to scale

## 🚀 Future Enhancements

Planned features:
- [ ] Multiple startup types (SaaS, Hardware, Marketplace)
- [ ] Industry-specific events
- [ ] Multiplayer competitive mode
- [ ] Historical startup scenarios
- [ ] More co-founder personalities
- [ ] Random event system
- [ ] Achievement badges
- [ ] Leaderboard (optional Firebase)
- [ ] Save/Load multiple games
- [ ] Difficulty levels

## 🤝 Contributing

Want to add events or features? Contributions welcome!

1. Fork the repository
2. Create your feature branch
3. Add events to `storyEvents.js`
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🎮 Play Now!

**What would your startup become?**

[Live Demo](https://AUTHOR_HANDLE.github.io/startup-lifecycle/)

---

Built with ❤️ for aspiring entrepreneurs everywhere.

*Remember: In the real world, every startup journey is unique. This game is for entertainment and education.*
