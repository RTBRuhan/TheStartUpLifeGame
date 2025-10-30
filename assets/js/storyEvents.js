/**
 * Story Events Database
 * Contains all narrative events and decision points
 */

const STORY_EVENTS = [
  // === IDEA STAGE ===
  {
    id: 'idea_1',
    stage: 'idea',
    title: 'The Spark',
    description: 'You wake up at 3 AM with an idea that could change everything. Do you quit your job to pursue it full-time?',
    choices: [
      {
        text: '🚀 Quit immediately and go all-in',
        quality: 'bad',
        effect: { money: -10000, morale: -10, product: +10, reputation: -5 },
        result: 'You quit. Your family thinks you\'re crazy. Your savings are draining fast.'
      },
      {
        text: '💼 Keep the job, build on weekends',
        quality: 'good',
        effect: { money: +5000, product: +5, morale: -5 },
        result: 'Smart move. You save money while validating your idea. Slow but steady wins the race.'
      },
      {
        text: '🤝 Find a co-founder first',
        quality: 'neutral',
        effect: { getCofounder: true, product: +3, money: -2000 },
        result: 'You reach out to your network. Finding someone who shares your vision AND is willing to quit their job is brutal.'
      }
    ]
  },
  
  {
    id: 'idea_2',
    stage: 'idea',
    title: 'The Pitch',
    description: 'Your friend wants to invest $20K for 40% equity. It\'s quick money, but is it worth it?',
    choices: [
      {
        text: '✅ Accept the deal',
        quality: 'bad',
        effect: { money: +10000, reputation: -10, morale: -15 },
        result: 'You take the money. They want weekly updates and keep questioning every decision. The pressure is killing your creativity.'
      },
      {
        text: '❌ Decline, bootstrap it',
        quality: 'good',
        effect: { morale: +5, reputation: +10 },
        result: 'You politely decline. Your friend respects the decision. You stay lean and maintain full control.'
      },
      {
        text: '🤝 Counter with 10% + advisory role',
        quality: 'neutral',
        effect: { money: +8000, reputation: +5 },
        result: 'They accept! Less dilution and they bring valuable expertise. Not bad.'
      }
    ]
  },
  
  {
    id: 'idea_3',
    stage: 'idea',
    title: 'Market Research',
    description: 'Should you spend time and money on formal market research, or just start building?',
    choices: [
      {
        text: '📊 Hire a research firm ($5K)',
        quality: 'bad',
        effect: { money: -5000, product: +3, reputation: +5 },
        result: 'The research is generic and tells you nothing you didn\'t already know. Wasted money.'
      },
      {
        text: '💬 Talk to 50 potential users',
        quality: 'good',
        effect: { product: +15, reputation: +10, morale: +5 },
        result: 'You spend 3 weeks doing customer interviews. The insights are GOLD. You pivot your approach.'
      },
      {
        text: '⚡ Skip it, trust your gut',
        quality: 'bad',
        effect: { product: +8, reputation: -5 },
        result: 'You dive straight into building. You\'re excited, but are you solving a real problem?'
      }
    ]
  },
  
  // === BUILDING STAGE ===
  {
    id: 'build_1',
    stage: 'building',
    title: 'Tech Stack Decision',
    condition: { product: 20 },
    description: 'You need to choose your technology stack. Speed vs. Scalability?',
    choices: [
      {
        text: '⚡ Fast & dirty - PHP/WordPress',
        quality: 'good',
        effect: { product: +20, money: -2000, morale: +5 },
        result: 'You ship MVP in 2 weeks! Sure, the code isn\'t perfect, but you can iterate fast and validate your idea.'
      },
      {
        text: '🏗️ Scalable - React/Node/AWS',
        quality: 'bad',
        effect: { product: +8, money: -8000, morale: -10 },
        result: 'You spend 6 weeks on setup. By the time you launch, 2 competitors already have MVPs in market.'
      },
      {
        text: '🚀 Bleeding edge - Next.js/Serverless',
        quality: 'neutral',
        effect: { product: +12, money: -5000, reputation: +10 },
        result: 'Modern stack with good balance. Learning curve slows you down a bit, but the community is helpful.'
      }
    ]
  },
  
  {
    id: 'build_2',
    stage: 'building',
    condition: { product: 30, hasCofounder: true },
    title: 'Co-founder Conflict',
    description: 'Your co-founder wants to pivot the product direction. This could derail everything you\'ve built.',
    choices: [
      {
        text: '🤝 Listen and compromise',
        quality: 'good',
        effect: { cofounderRelationship: +20, product: -5, morale: +10 },
        result: 'You find middle ground. The relationship is stronger, even if progress slowed.'
      },
      {
        text: '💪 Stand your ground',
        quality: 'neutral',
        effect: { cofounderRelationship: -15, product: +10 },
        result: 'You push forward with your vision. Tension is building.'
      },
      {
        text: '🔥 Get aggressive',
        quality: 'bad',
        effect: { cofounderRelationship: -30, morale: -20 },
        result: 'The argument escalates. This partnership might not survive.'
      }
    ]
  },
  
  {
    id: 'build_3',
    stage: 'building',
    condition: { product: 40 },
    title: 'First Hire',
    description: 'You need help. A talented developer wants $80K/year. Can you afford it?',
    choices: [
      {
        text: '✅ Hire them full-time',
        quality: 'bad',
        effect: { team: +1, money: -20000, product: +10, morale: -15 },
        result: 'You hire them. They take 3 weeks to onboard. Burn rate is now $10K/month. You have 2-3 months runway left.'
      },
      {
        text: '💼 Offer equity + smaller salary',
        quality: 'good',
        effect: { team: +1, product: +15, morale: +5, money: -10000 },
        result: 'They accept 2% equity + $40K. They\'re motivated by ownership and ship features fast!'
      },
      {
        text: '⏰ Wait until you have revenue',
        quality: 'neutral',
        effect: { product: +8, morale: -10 },
        result: 'You keep grinding solo. Progress is slow, but your burn rate stays low.'
      }
    ]
  },
  
  {
    id: 'build_4',
    stage: 'building',
    condition: { product: 50, team: 1 },
    title: 'Burnout Warning',
    description: 'You\'ve been coding 16 hours a day for 3 months. Your body is screaming for rest.',
    choices: [
      {
        text: '😤 Push through it',
        quality: 'bad',
        effect: { product: +15, morale: -30, reputation: -10 },
        result: 'You keep grinding. At month 4, you have a health scare. Hospital bills eat into your runway.'
      },
      {
        text: '🏖️ Take a week off',
        quality: 'neutral',
        effect: { morale: +25, product: -8 },
        result: 'You disconnect completely. It helps, but you lost a week of critical progress.'
      },
      {
        text: '⚖️ Set sustainable schedule',
        quality: 'good',
        effect: { morale: +20, product: +12, reputation: +10 },
        result: 'You set boundaries: 8 AM to 7 PM, 5 days/week. Your code quality improves dramatically.'
      }
    ]
  },
  
  // === LAUNCHING STAGE ===
  {
    id: 'launch_1',
    stage: 'launching',
    condition: { product: 70 },
    title: 'Launch Strategy',
    description: 'Your MVP is ready! How do you launch?',
    choices: [
      {
        text: '🎯 Product Hunt launch',
        quality: 'neutral',
        effect: { users: +400, reputation: +10, money: -3000 },
        result: 'You hit #8 Product of the Day. Decent traffic, but tons of tire-kickers with low conversion.'
      },
      {
        text: '🤝 Personal outreach to 100 users',
        quality: 'good',
        effect: { users: +150, reputation: +20, morale: +10 },
        result: 'You email potential users personally. Only 150 sign up, but they LOVE the product and give amazing feedback!'
      },
      {
        text: '💰 Pay for ads ($10K)',
        quality: 'bad',
        effect: { users: +300, money: -15000, reputation: +5 },
        result: 'Google Ads brings traffic but 90% bounce. Your CAC is $50 per user. This won\'t scale.'
      }
    ]
  },
  
  {
    id: 'launch_2',
    stage: 'launching',
    condition: { users: 100 },
    title: 'Critical Bug',
    description: 'Users are reporting data loss! A critical bug is destroying your reputation.',
    choices: [
      {
        text: '🚨 Emergency all-nighter',
        quality: 'good',
        effect: { reputation: -10, morale: -15, product: +10 },
        result: 'You fix it in 6 hours. Some damage to reputation but users appreciate the speed.'
      },
      {
        text: '📢 Honest communication',
        quality: 'good',
        effect: { reputation: +5, users: -20 },
        result: 'You publicly acknowledge the issue and timeline. Most users understand.'
      },
      {
        text: '🤫 Try to hide it',
        quality: 'bad',
        effect: { reputation: -30, users: -50 },
        result: 'Word gets out. The coverup is worse than the bug. Trust is destroyed.'
      }
    ]
  },
  
  {
    id: 'launch_3',
    stage: 'launching',
    condition: { users: 200, money: -5000 },
    title: 'Running Out of Money',
    description: 'You have 2 months of runway left. Emergency decision time!',
    choices: [
      {
        text: '💼 Get a part-time job',
        quality: 'good',
        effect: { money: +8000, product: -10, morale: -10 },
        result: 'Pride hurts, but bills get paid. Development slows down significantly.'
      },
      {
        text: '🏦 Raise angel round',
        quality: 'neutral',
        effect: { money: +50000, reputation: +10, product: -5 },
        result: 'An angel believes in you! But now the pressure is on to deliver.'
      },
      {
        text: '💳 Max out credit cards',
        quality: 'bad',
        effect: { money: +20000, morale: -20 },
        result: 'You\'re all in. $20K in debt at 24% APR. This better work.'
      }
    ]
  },
  
  {
    id: 'launch_4',
    stage: 'launching',
    condition: { users: 500, revenue: 0 },
    title: 'First Revenue Opportunity',
    description: 'Users are asking about paid features. Time to monetize?',
    choices: [
      {
        text: '💰 Launch premium tier ($10/mo)',
        quality: 'good',
        effect: { revenue: +1500, users: -50, reputation: +5 },
        result: '3% of users upgrade immediately! First revenue feels amazing.'
      },
      {
        text: '🎯 One-time payment ($49)',
        quality: 'neutral',
        effect: { revenue: +2500, users: -20 },
        result: 'You close 50 sales in the first week. Cash in the bank!'
      },
      {
        text: '⏰ Wait for more users',
        quality: 'bad',
        effect: { users: +100, morale: -5 },
        result: 'You delay monetization. Competitors are moving faster.'
      }
    ]
  },
  
  {
    id: 'launch_5',
    stage: 'launching',
    condition: { users: 1000, revenue: -1000 },
    title: 'Pricing Strategy',
    description: 'You need to figure out sustainable pricing. What\'s your model?',
    choices: [
      {
        text: '💎 Freemium ($15/mo pro)',
        quality: 'good',
        effect: { revenue: +3000, users: -100, reputation: +10 },
        result: '5% conversion rate! The free tier drives organic growth.'
      },
      {
        text: '🏢 B2B focus ($99/mo)',
        quality: 'good',
        effect: { revenue: +5000, users: +200, reputation: +15, morale: +10 },
        result: 'Companies are willing to pay! 50 businesses sign up.'
      },
      {
        text: '🎁 Keep it free, run ads',
        quality: 'neutral',
        effect: { revenue: +800, users: +500, reputation: -10 },
        result: 'Ad revenue is low but growing. Users complain about ads.'
      }
    ]
  },
  
  {
    id: 'launch_6',
    stage: 'launching',
    condition: { users: 2000, revenue: 1000 },
    title: 'Growth vs Revenue',
    description: 'Early revenue is coming in. Should you focus on growth or monetization?',
    choices: [
      {
        text: '📈 All in on growth',
        quality: 'bad',
        effect: { users: +3000, revenue: -1000, money: -8000, morale: -5 },
        result: 'Growth explodes but you run out of money. Churn is high because product isn\'t ready for scale.'
      },
      {
        text: '💰 Optimize for revenue first',
        quality: 'good',
        effect: { revenue: +5000, users: +500, reputation: +15, morale: +10 },
        result: 'Smart move! Strong revenue gives you runway. Growth follows naturally when product is great.'
      },
      {
        text: '⚖️ Split focus 50/50',
        quality: 'neutral',
        effect: { revenue: +2000, users: +1500, product: +5 },
        result: 'You try to do both. Progress on each front is slower than you\'d like.'
      }
    ]
  },
  
  // === GROWING STAGE ===
  {
    id: 'grow_1',
    stage: 'growing',
    condition: { users: 1000, revenue: 0 },
    title: 'Monetization Time',
    description: 'You have users but no revenue. How do you monetize?',
    choices: [
      {
        text: '💎 Freemium model',
        quality: 'neutral',
        effect: { revenue: +2000, users: -100, reputation: +5 },
        result: '2% convert to paid. Better than nothing, but you expected more.'
      },
      {
        text: '📢 Strategic ads (non-intrusive)',
        quality: 'good',
        effect: { revenue: +3000, users: +200, reputation: +10 },
        result: 'You carefully place relevant ads. Users don\'t mind and some even click! Revenue flows in.'
      },
      {
        text: '🎯 B2B enterprise pivot',
        quality: 'bad',
        effect: { revenue: +8000, product: -20, team: +2, morale: -15 },
        result: 'You land one big client, but they want custom features. You\'re now building for one customer.'
      }
    ]
  },
  
  {
    id: 'grow_2',
    stage: 'growing',
    condition: { users: 2000, team: 3 },
    title: 'Scaling Pains',
    description: 'Your servers are crashing daily. Infrastructure is breaking.',
    choices: [
      {
        text: '☁️ Move to AWS immediately',
        quality: 'bad',
        effect: { money: -20000, reputation: +5, users: +200, morale: -10 },
        result: 'Expensive! Monthly bills eat your runway. Stable but not sustainable.'
      },
      {
        text: '🔧 Optimize code first, then scale',
        quality: 'good',
        effect: { product: +15, money: -8000, reputation: +15 },
        result: 'Smart! You refactor first, identify bottlenecks, THEN scale. Cheaper and more efficient.'
      },
      {
        text: '🤷 Ride it out',
        quality: 'bad',
        effect: { reputation: -30, users: -800, morale: -20 },
        result: 'Disaster. A 6-hour outage goes viral on Twitter. Your reputation tanks.'
      }
    ]
  },
  
  {
    id: 'grow_3',
    stage: 'growing',
    condition: { users: 5000, hasCofounder: true },
    title: 'The Betrayal',
    description: 'Your co-founder got a job offer at Google for $300K. They want to leave.',
    choices: [
      {
        text: '💔 Let them go gracefully',
        quality: 'good',
        effect: { team: -1, morale: -15, reputation: +10 },
        result: 'You wish them well. The team respects how you handled it.'
      },
      {
        text: '💰 Counter-offer with equity',
        quality: 'neutral',
        effect: { cofounderRelationship: +20, money: -10000 },
        result: 'They stay, but you had to give up more equity and pay a salary now.'
      },
      {
        text: '😤 Burn the bridge',
        quality: 'bad',
        effect: { cofounderRelationship: -100, reputation: -20, morale: -30 },
        result: 'You say things you regret. The team sees the ugly side of you.'
      }
    ]
  },
  
  {
    id: 'grow_4',
    stage: 'growing',
    condition: { revenue: 10000 },
    title: 'Investor Interest',
    description: 'A VC wants to lead a $2M round at $8M valuation. Do you raise?',
    choices: [
      {
        text: '✅ Take the deal immediately',
        quality: 'bad',
        effect: { money: +2000000, reputation: +10, team: +5, morale: -10 },
        result: 'You take the first offer. Later you find out 3 other VCs wanted in at better terms. Oops.'
      },
      {
        text: '🤝 Create competition between VCs',
        quality: 'good',
        effect: { money: +2500000, reputation: +25, team: +5 },
        result: 'You talk to 5 VCs. They compete! You get $2.5M at $12M valuation. Well played.'
      },
      {
        text: '❌ Stay bootstrapped',
        quality: 'neutral',
        effect: { morale: +15, reputation: +10 },
        result: 'You politely decline. Growing slower but you own 100%. More freedom, less pressure.'
      }
    ]
  },
  
  // === SCALING STAGE ===
  {
    id: 'scale_1',
    stage: 'scaling',
    condition: { team: 10, revenue: 50000 },
    title: 'Hiring Spree',
    description: 'You need to scale the team fast. Do you hire slow and careful, or fast and fix later?',
    choices: [
      {
        text: '🐌 Hire slow, hire right',
        quality: 'good',
        effect: { team: +3, money: -50000, morale: +15 },
        result: 'Every new hire is excellent. Culture stays strong.'
      },
      {
        text: '⚡ Hire fast, scale now',
        quality: 'neutral',
        effect: { team: +10, money: -150000, morale: -10 },
        result: 'You triple the team in a month. Some hires are misses.'
      },
      {
        text: '💰 Poach from competitors',
        quality: 'bad',
        effect: { team: +5, money: -200000, reputation: -20 },
        result: 'You outbid competitors for talent. It works, but the industry notices.'
      }
    ]
  },
  
  {
    id: 'scale_2',
    stage: 'scaling',
    condition: { users: 50000 },
    title: 'Acquisition Offer',
    description: 'Google offers $50M to acquire your company. This could be your exit!',
    choices: [
      {
        text: '🎉 Accept and exit',
        quality: 'neutral',
        effect: { money: +50000000 },
        result: 'You accept! Life-changing money. But you\'ll always wonder what could have been.',
        exitGame: true
      },
      {
        text: '🚀 Decline, aim higher',
        quality: 'good',
        effect: { reputation: +30, morale: +20 },
        result: 'You decline. The team is energized. You\'re going for unicorn status.'
      },
      {
        text: '🤝 Negotiate for more',
        quality: 'neutral',
        effect: { money: +75000000, reputation: +20 },
        result: 'They agree to $75M! You got them to raise the offer.',
        exitGame: true
      }
    ]
  },
  
  {
    id: 'scale_3',
    stage: 'scaling',
    condition: { revenue: 100000 },
    title: 'International Expansion',
    description: 'Your product is successful in the US. Time to go global?',
    choices: [
      {
        text: '🌍 Expand to Europe',
        quality: 'good',
        effect: { users: +10000, money: -100000, revenue: +20000 },
        result: 'Europe loves you! Revenue is growing across the pond.'
      },
      {
        text: '🇯🇵 Focus on Asia',
        quality: 'neutral',
        effect: { users: +20000, money: -150000, revenue: +15000 },
        result: 'Cultural differences are challenging but the market is huge.'
      },
      {
        text: '🇺🇸 Dominate home market first',
        quality: 'good',
        effect: { users: +5000, revenue: +30000, reputation: +10 },
        result: 'Smart move. You solidify your position before expanding.'
      }
    ]
  },
  
  // === ANY STAGE EVENTS ===
  {
    id: 'any_competitor',
    stage: 'any',
    condition: { users: 500 },
    title: 'New Competitor',
    description: 'A well-funded competitor just launched with your exact features. What do you do?',
    choices: [
      {
        text: '⚡ Out-ship them with features',
        quality: 'bad',
        effect: { product: +15, morale: -15, reputation: -5, money: -5000 },
        result: 'You burn out trying to keep up. Feature bloat makes your product confusing. Users leave.'
      },
      {
        text: '🎯 Double down on your niche',
        quality: 'good',
        effect: { product: +10, reputation: +20, users: +500, morale: +15 },
        result: 'You ignore the noise and focus on what makes you unique. Your loyal users appreciate it!'
      },
      {
        text: '😰 Panic and pivot',
        quality: 'bad',
        effect: { product: -20, morale: -25, users: -300, reputation: -15 },
        result: 'You change direction hastily. This confuses your users and team. Total chaos.'
      }
    ]
  },
  
  {
    id: 'any_press',
    stage: 'any',
    condition: { users: 1000 },
    title: 'Press Opportunity',
    description: 'TechCrunch wants to write about you. But they want exclusive access to your metrics.',
    choices: [
      {
        text: '📰 Full transparency',
        quality: 'bad',
        effect: { users: +1500, reputation: +15, money: -3000 },
        result: 'The article reveals your weak MRR. Competitors now know your strategy. Mixed results.'
      },
      {
        text: '🎯 Share story, not just metrics',
        quality: 'good',
        effect: { users: +2500, reputation: +30, morale: +15 },
        result: 'You share your founder journey AND selective metrics. The article is inspiring! Traffic explodes.'
      },
      {
        text: '❌ Decline politely',
        quality: 'neutral',
        effect: { reputation: +5, morale: +5 },
        result: 'You pass. You\'d rather let the product speak for itself. Respect.'
      }
    ]
  }
];

// Helper to replace cofounder name placeholder
function prepareEvent(event, cofounderName) {
  if (!cofounderName) return event;
  
  return {
    ...event,
    description: event.description.replace(/\${COFOUNDER_NAME}/g, cofounderName),
    choices: event.choices.map(choice => ({
      ...choice,
      result: choice.result.replace(/\${COFOUNDER_NAME}/g, cofounderName)
    }))
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STORY_EVENTS, prepareEvent };
}

