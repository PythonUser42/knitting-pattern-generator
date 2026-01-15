---
name: ux
description: UX design guidance for user engagement and trust. Use when designing interfaces, improving conversions, building trust signals, implementing ethical engagement patterns, or evaluating UX decisions.
---

# UX Design: Engagement & Trust

Expert guidance for creating engaging, trustworthy user experiences based on research from Nielsen Norman Group, Baymard Institute, and leading design teams.

## When to Use

- Designing user interfaces or improving existing ones
- Building features that drive engagement ethically
- Adding trust signals to increase conversions
- Implementing onboarding or retention flows
- Evaluating UX patterns for dark patterns vs. ethical design
- Creating AI interfaces that foster trust
- Designing e-commerce checkout flows
- Handling errors gracefully to maintain trust

## Core Principles

### The Engagement Equation
**Motivation x Ability x Trigger = Behavior** (Fogg's Behavior Model)
- High motivation + easy action + timely trigger = engagement
- Remove friction before adding motivation

### The Trust Pyramid
Users progress through 5 commitment levels before sharing information or money:
1. Baseline (first impression)
2. Interest (exploring)
3. Trust (willing to engage)
4. Transact (share info/money)
5. Loyalty (repeat behavior)

**Key insight**: Sites fail when demanding too much too soon.

### Ethical vs. Manipulative Design
| Ethical (White Hat) | Manipulative (Black Hat) |
|---------------------|--------------------------|
| Empowers user goals | Exploits psychological weaknesses |
| Transparent mechanics | Hidden or deceptive mechanics |
| Easy to disengage | Creates artificial lock-in |
| Real value first | Rewards before value |

## Quick Reference

### Engagement Patterns

**Progressive Disclosure**: Reveal complexity gradually
- Show essential options first
- Expand on demand
- Example: Asana's task creation

**Habit Loops** (Hook Model):
1. Trigger (internal or external)
2. Action (simple behavior)
3. Variable Reward (unpredictable payoff)
4. Investment (user effort that improves next loop)

**Deferred Choices**: Let users skip decisions and return later
- Reduces cognitive load
- Improves completion rates

### Trust Signals

**4 Credibility Factors** (Nielsen Norman Group):
1. Design quality (professional appearance)
2. Upfront disclosure (no hidden information)
3. Comprehensive content (thorough, helpful)
4. Connection to the web (external validation)

**E-commerce Trust** (Baymard Institute):
- 19% abandon checkout due to distrust
- Norton-backed seals outperform SSL seals
- Only 11% of top sites properly reinforce CC field security
- 35% conversion increase possible from UX improvements

### Error Handling

Good error messages build trust:
1. **Noticeable**: Clear visual indicators
2. **Human-readable**: Plain language, no codes
3. **Timely**: Immediate feedback
4. **Actionable**: Tell users how to fix it
5. **Accessible**: Screen reader compatible

**Placement**: Errors above input fields improve accessibility.

## Measuring Success

### HEART Framework (Google)
| Metric | Measures | Example |
|--------|----------|---------|
| Happiness | User satisfaction | NPS, survey ratings |
| Engagement | User involvement | DAU/MAU, session duration |
| Adoption | New user uptake | New accounts, feature adoption |
| Retention | Return behavior | Churn rate, renewal rate |
| Task Success | Efficiency | Completion rate, time on task |

### Key Metrics
- **Session frequency**: How often users return
- **Feature adoption**: % using key features
- **Net Revenue Retention**: Revenue from existing customers over time
- **Churn rate**: % of users lost per period

## Detailed References

For comprehensive guidance on specific topics:
- [ENGAGEMENT.md](ENGAGEMENT.md) - Psychology, behavioral patterns, gamification, habit design
- [TRUST.md](TRUST.md) - Trust signals, privacy design, error handling, AI interfaces
- [RESOURCES.md](RESOURCES.md) - 80+ curated free resources organized by topic

## Implementation Checklist

### Before Launch
- [ ] Test with real users (not just team members)
- [ ] Audit for dark patterns (Confirmshaming, hidden fees, forced continuity)
- [ ] Verify trust signals are present at decision points
- [ ] Ensure errors are helpful, not blame-shifting
- [ ] Check forms for unnecessary friction

### Engagement Review
- [ ] Clear value proposition within 5 seconds
- [ ] Progressive disclosure for complex features
- [ ] Deferred choices where appropriate
- [ ] Habit loops create genuine value
- [ ] Easy exit paths (no artificial lock-in)

### Trust Review
- [ ] Professional visual design
- [ ] Transparent pricing and policies
- [ ] Third-party validation visible
- [ ] Privacy controls accessible
- [ ] Contact information available

## Common Mistakes

| Mistake | Better Approach |
|---------|-----------------|
| Asking for account creation before showing value | Let users explore first, then prompt registration |
| Trust seals in footer only | Place seals near credit card fields |
| Generic error messages | Specific, actionable guidance |
| Hiding unsubscribe | Make exit easy (builds long-term trust) |
| Gamification without value | Rewards tied to genuine progress |
| Too many notifications | Respect attention, use sparingly |

## Examples

### Good: Duolingo Engagement
- Clear trigger (daily reminder)
- Simple action (one lesson)
- Variable reward (streak, XP, leaderboard)
- Investment (friends, progress, streak)
- Easy exit (can skip days, no penalty messaging)

### Good: Airbnb Trust
- Verified photos and IDs
- Two-way review system
- Clear policies upfront
- Host/guest matching by reputation
- "High reputation beats high similarity"

### Bad: Dark Patterns
- Confirmshaming: "No thanks, I don't want to save money"
- Hidden fees: Surprise charges at checkout
- Trick questions: Double negatives in opt-outs
- Forced continuity: Hard-to-cancel subscriptions
