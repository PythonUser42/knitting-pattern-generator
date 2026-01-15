# User Engagement: Psychology and Practice

Detailed guidance on creating engaging user experiences ethically.

## Foundational Psychology

### Key Laws

**Hick's Law**: Decision time increases with the number and complexity of choices.
- Reduce options to speed decisions
- Group related choices
- Use progressive disclosure

**Miller's Law**: Average person can hold 7 (plus or minus 2) items in working memory.
- Chunk information into digestible groups
- Don't overload interfaces with options
- Use visual hierarchy to guide attention

**Jakob's Law**: Users spend most time on other sites, so they expect yours to work similarly.
- Follow established conventions
- Don't reinvent navigation patterns
- Match mental models from popular products

**Fitts's Law**: Time to reach a target depends on distance and size.
- Make important buttons larger
- Place key actions within easy reach
- Reduce movement between related actions

### Fogg Behavior Model

**B = MAT** (Behavior = Motivation x Ability x Trigger)

When behavior doesn't happen, diagnose:
1. Is motivation sufficient?
2. Is the action easy enough?
3. Did a trigger occur at the right moment?

**Ability factors** (make it easier):
- Time (does it take too long?)
- Money (does it cost too much?)
- Physical effort (is it too hard?)
- Mental effort (is it too confusing?)
- Social deviance (does it feel weird?)
- Non-routine (is it unfamiliar?)

**Trigger types**:
- Spark: High ability, low motivation (inspire them)
- Facilitator: High motivation, low ability (make it easy)
- Signal: High motivation, high ability (just remind them)

## Behavioral Design Patterns

### Progressive Disclosure
Reveal complexity gradually as users need it.

**Implementation**:
1. Show only essential options initially
2. Provide clear paths to advanced features
3. Use contextual expansion (accordion, modals)
4. Remember user preferences for next time

**Example**: Asana's task creation
- Quick add: Just the title
- Expanded: Due date, assignee, project
- Advanced: Dependencies, custom fields, subtasks

### Deferred Choices
Let users skip decisions and return later.

**When to use**:
- Non-critical configuration
- Personalization that requires exploration
- Decisions that benefit from more context

**Implementation**:
- Clear "Skip for now" options
- Easy access to deferred settings
- Smart defaults that work without customization

### Habituation
Design for repeated use without fatigue.

**Principles**:
- Consistent locations for key actions
- Keyboard shortcuts for power users
- Reduce friction in repeated tasks
- Vary rewards, not core interactions

### Commitment and Consistency
People want to act consistently with past behavior.

**Ethical use**:
- Start with small, easy commitments
- Build on previous actions
- Reference user's stated goals
- Don't exploit for manipulation

## Gamification Done Ethically

### Octalysis Framework (Yu-kai Chou)

**White Hat (Empowering)**:
1. Epic Meaning - Contributing to something greater
2. Accomplishment - Mastery and achievement
3. Empowerment - Creativity and feedback

**Black Hat (Coercive)**:
4. Scarcity - Limited availability
5. Unpredictability - Curiosity, variable rewards
6. Avoidance - Fear of loss

**Best practice**: Lead with White Hat, use Black Hat sparingly and transparently.

### Ethical Gamification Principles

1. **Transparent Goals**: Users know how the system works
2. **Easy Exits**: Can stop without penalty
3. **Real Value First**: Rewards tied to genuine progress
4. **User Control**: Can customize or disable
5. **Ethical Rewards**: No exploitation of psychological vulnerabilities

### Good Examples
- **Calm/Headspace**: Progress tied to actual meditation practice
- **Duolingo**: Learning streaks encourage consistency
- **Strava**: Social competition with opt-in comparison

### Problematic Patterns
- Notifications that shame absence
- Artificial scarcity (only 2 left!)
- Loss aversion exploitation
- Social pressure mechanics
- Pay-to-win progression

## Habit-Forming Design

### The Hook Model (Nir Eyal)

**4 Phases**:

1. **Trigger**
   - External: Notifications, emails, ads
   - Internal: Emotions, situations, routines
   - Goal: Move from external to internal triggers

2. **Action**
   - Simple behavior in anticipation of reward
   - Must be easier than thinking about it
   - Example: Opening app, scrolling feed

3. **Variable Reward**
   - Unpredictable payoff sustains interest
   - Types: Tribe (social), Hunt (resources), Self (mastery)
   - Predictable rewards lose power

4. **Investment**
   - User puts something in (time, data, effort)
   - Improves the product for next use
   - Creates switching costs

### The Manipulation Matrix

Before implementing habit design, evaluate:

| | User believes it improves their life | User doesn't believe it improves their life |
|---|---|---|
| **Maker uses the product** | Facilitator (ideal) | Entertainer |
| **Maker doesn't use the product** | Peddler | Dealer (avoid) |

**Rule**: Only build habit-forming products you would use yourself for their stated purpose.

### Ethical Habit Design

**Do**:
- Create genuine value with each loop
- Support user's stated goals
- Provide usage insights and controls
- Design easy pause/exit mechanisms

**Don't**:
- Exploit loneliness or FOMO
- Use guilt-based notifications
- Create artificial urgency
- Hide time-spent data

## Measuring Engagement

### Choosing Metrics

**Nielsen Norman Group's 4-Step Process**:
1. Identify the goal (what behavior do you want?)
2. Determine behavioral signals (what indicates progress?)
3. Narrow to strongest signals (what's most meaningful?)
4. Define measurement methods (how will you track?)

**Common mistake**: Measuring what's easy instead of what matters.

### Key Metrics Defined

| Metric | Formula | Use Case |
|--------|---------|----------|
| DAU/MAU | Daily Active Users / Monthly Active Users | Overall stickiness |
| Session Frequency | Sessions / Unique Users / Time Period | Return behavior |
| Session Duration | Total Time / Total Sessions | Depth of engagement |
| Feature Adoption | Users of Feature / Total Users | Feature success |
| Retention Rate | Users at End / Users at Start | Long-term value |
| Churn Rate | Users Lost / Users at Start | Problem detection |
| NPS | % Promoters - % Detractors | User satisfaction |

### Engagement Benchmarks

**DAU/MAU Ratios**:
- 50%+ : Exceptional (daily habit)
- 25-50%: Strong (regular use)
- 10-25%: Good (weekly use)
- <10%: Needs improvement

**Retention Targets** (vary by product type):
- Day 1: 40%+
- Day 7: 20%+
- Day 30: 10%+

## Case Study Patterns

### High-Engagement Products

**Slack**:
- Reduced time to first message
- Team-based network effects
- Integrations create switching costs
- Keyboard shortcuts for power users

**Spotify**:
- Personalization improves with use
- Social features (collaborative playlists)
- Discover Weekly creates weekly habit
- Investment in playlists/follows

**Airbnb**:
- Trust system enables transactions
- Reviews create value for community
- Wishlist investment
- Travel-triggered internal triggers

### Onboarding Patterns

**Dropbox** finding: Presenting intro flows before login increased both signups and engagement.
- "Giving users more information is better than getting them to log in quickly"

**Key onboarding principles**:
1. Show value before asking for commitment
2. Progressive profiling (don't ask everything at once)
3. Quick wins in first session
4. Clear path to "aha moment"
