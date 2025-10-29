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
        effect: { money: +1000, product: +3, morale: -5 },
        result: 'Smart move. But you\'re exhausted. 9-5 job + 6-midnight coding. Sleep is a luxury.'
      },
      {
        text: '🤝 Find a co-founder first',
        quality: 'neutral',
        effect: { getCofounder: true, product: +5, money: -2000 },
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
        effect: { money: +10000, reputation: -10, morale: -10 },
        result: 'You take the money. They want weekly updates and keep questioning every decision. The pressure is immense.'
      },
      {
        text: '❌ Decline, bootstrap it',
        quality: 'neutral',
        effect: { morale: -5, reputation: +5 },
        result: 'You decline. Now you have no money and your friend is offended. Awkward.'
      },
      {
        text: '🤝 Counter with 20%',
        quality: 'bad',
        effect: { money: -5000, reputation: -15 },
        result: 'They\'re insulted and walk away. Word spreads that you\'re "difficult to work with."'
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
        quality: 'neutral',
        effect: { money: -5000, product: +10, reputation: +10 },
        result: 'The research reveals your target market is larger than expected!'
      },
      {
        text: '💬 DIY with surveys',
        quality: 'good',
        effect: { product: +15, reputation: +5 },
        result: 'You create Google Forms and hit up Reddit. The feedback is invaluable.'
      },
      {
        text: '⚡ Skip it, trust your gut',
        quality: 'bad',
        effect: { product: +20, reputation: -10 },
        result: 'You dive straight into building. Time will tell if you\'re right about the market.'
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
        quality: 'bad',
        effect: { product: +15, money: -3000 },
        result: 'You ship fast but the code is a mess. Every new feature takes 3x longer than expected.'
      },
      {
        text: '🏗️ Scalable - React/Node/AWS',
        quality: 'neutral',
        effect: { product: +8, money: -8000, morale: -10 },
        result: 'It takes 3 months to set up. Your money is burning. Are you over-engineering?'
      },
      {
        text: '🚀 Bleeding edge - Next.js/Serverless',
        quality: 'bad',
        effect: { product: +10, money: -6000, reputation: -10 },
        result: 'Cool tech, but docs are sparse. You spend weeks debugging edge cases.'
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
        text: '💼 Offer equity instead',
        quality: 'neutral',
        effect: { team: +1, product: +12, morale: -5, money: -8000 },
        result: 'They want 5% equity + $50K salary. You negotiate down to 3% but you\'re still burning cash.'
      },
      {
        text: '🌍 Hire overseas contractor',
        quality: 'bad',
        effect: { money: -6000, product: +5, reputation: -10 },
        result: 'Communication is brutal. Code quality is questionable. You spend more time reviewing than they spend coding.'
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
        effect: { product: +15, morale: -25, reputation: -5 },
        result: 'You keep grinding. The code is getting sloppy and you\'re making mistakes.'
      },
      {
        text: '🏖️ Take a week off',
        quality: 'good',
        effect: { morale: +30, product: -5 },
        result: 'You disconnect completely. Coming back, you see solutions you missed before.'
      },
      {
        text: '⚖️ Work smarter, not harder',
        quality: 'good',
        effect: { morale: +15, product: +10, reputation: +5 },
        result: 'You set boundaries: 9 AM to 6 PM, no exceptions. Productivity actually increases.'
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
        quality: 'good',
        effect: { users: +500, reputation: +15, money: -1000 },
        result: 'You hit #3 Product of the Day! Traffic is pouring in.'
      },
      {
        text: '🔥 Viral Twitter thread',
        quality: 'neutral',
        effect: { users: +300, reputation: +10 },
        result: 'Your thread gets 50K views. Some users are signing up!'
      },
      {
        text: '💰 Pay for ads',
        quality: 'neutral',
        effect: { users: +200, money: -8000, reputation: +5 },
        result: 'Google Ads brings steady traffic but CAC is high.'
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
        quality: 'good',
        effect: { revenue: +2000, users: -100, reputation: +10 },
        result: '3% convert to paid. It\'s working! Revenue is flowing in.'
      },
      {
        text: '📢 Ads everywhere',
        quality: 'bad',
        effect: { revenue: +1000, users: -300, reputation: -20 },
        result: 'Users hate the ads. Many are leaving. Short-term gain, long-term pain.'
      },
      {
        text: '🎯 B2B enterprise pivot',
        quality: 'neutral',
        effect: { revenue: +10000, product: -15, team: +2 },
        result: 'You land a $10K/month contract! But now you\'re building enterprise features.'
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
        text: '☁️ Move to AWS/Scale up',
        quality: 'good',
        effect: { money: -15000, reputation: +10, users: +500 },
        result: 'Expensive but stable. No more downtime.'
      },
      {
        text: '🔧 Optimize existing code',
        quality: 'good',
        effect: { product: +15, money: -5000 },
        result: 'You refactor everything. It\'s faster and cheaper now.'
      },
      {
        text: '🤷 Hope it holds',
        quality: 'bad',
        effect: { reputation: -25, users: -500 },
        result: 'It doesn\'t hold. A massive outage loses you hundreds of users.'
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
        text: '✅ Take the money',
        quality: 'neutral',
        effect: { money: +2000000, reputation: +20, team: +5 },
        result: 'You\'re Series A funded! Time to scale. The pressure is intense.'
      },
      {
        text: '🤝 Negotiate for better terms',
        quality: 'good',
        effect: { money: +1500000, reputation: +15 },
        result: 'You get $1.5M at $10M valuation. Less dilution, same outcome.'
      },
      {
        text: '❌ Stay bootstrapped',
        quality: 'neutral',
        effect: { morale: +20, reputation: +10 },
        result: 'You politely decline. Growing slower but you own 100%.'
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
        text: '⚡ Out-ship them',
        quality: 'good',
        effect: { product: +20, morale: +10, reputation: +10 },
        result: 'You go into overdrive. Your pace of innovation is unmatched.'
      },
      {
        text: '📢 Marketing blitz',
        quality: 'neutral',
        effect: { money: -20000, users: +1000, reputation: +15 },
        result: 'You outspend them on marketing. It works, but it\'s expensive.'
      },
      {
        text: '😰 Panic and pivot',
        quality: 'bad',
        effect: { product: -20, morale: -20, users: -200 },
        result: 'You change direction hastily. This confuses your users.'
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
        quality: 'good',
        effect: { users: +2000, reputation: +25 },
        result: 'The article goes viral! Transparency builds trust.'
      },
      {
        text: '🎭 Share curated metrics',
        quality: 'neutral',
        effect: { users: +1000, reputation: +10 },
        result: 'You share only the good numbers. The article is positive.'
      },
      {
        text: '❌ Decline the coverage',
        quality: 'neutral',
        effect: { reputation: -5 },
        result: 'You pass. Maybe it wasn\'t the right time.'
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

