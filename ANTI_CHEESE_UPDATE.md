# Anti-Cheese Update: Random Choice Shuffling

## Problem Solved
Players could spam-click the same option (e.g., always pressing "1" or "2") to win the game by memorizing optimal choice positions.

## Solution Implemented
**Random Choice Shuffling**: Every time an event is displayed, the choices are shuffled randomly using the Fisher-Yates algorithm.

## How It Works

### 1. **Shuffling Logic** (in `renderEvent()`)
```javascript
// Create array of choices with their original indices
const shuffledChoices = event.choices.map((choice, originalIndex) => ({
  choice,
  originalIndex
}));

// Shuffle the array using Fisher-Yates algorithm
for (let i = shuffledChoices.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
}
```

### 2. **Mapping System**
- Each choice is stored with its **original index** (0, 1, 2)
- Choices are displayed in **random order** (shuffled)
- A **mapping array** (`currentChoiceMapping`) tracks which display position maps to which original choice
- When a player clicks a button or presses a number key, the mapping converts it back to the original choice index

### 3. **Keyboard Support**
- Pressing `1`, `2`, or `3` now corresponds to the **shuffled display order**
- The original choice index is looked up from the mapping
- Example:
  - Original: Choice A (index 0), Choice B (index 1), Choice C (index 2)
  - Shuffled: Choice C (shown as 1), Choice A (shown as 2), Choice B (shown as 3)
  - Pressing `1` → selects Choice C (original index 2)
  - Pressing `2` → selects Choice A (original index 0)
  - Pressing `3` → selects Choice B (original index 1)

## Benefits

### ✅ No More Spam-Clicking
- Players can't memorize "always press 2" strategies
- Every event requires reading and thinking about the actual choices

### ✅ Increased Replayability
- Same events feel fresh because choices appear in different orders
- Players must actually read the options each time

### ✅ Fair Difficulty
- Forces strategic thinking on every decision
- Prevents cheesing the game mechanics
- Makes the 99% failure rate more authentic

### ✅ Preserved User Experience
- All keyboard shortcuts still work perfectly
- Number keys (1, 2, 3) still correspond to visual position
- No impact on game performance

## Technical Details

### Files Modified:
- **`assets/js/gameUI.js`**:
  - Added `currentChoiceMapping` property to track shuffle mapping
  - Implemented Fisher-Yates shuffle in `renderEvent()`
  - Updated keyboard handler to use mapping
  - Button click handlers use original indices

### Algorithm Used:
**Fisher-Yates Shuffle** - A proven, unbiased shuffling algorithm that ensures every permutation has equal probability.

### Testing Checklist:
- [x] Choices appear in random order each time
- [x] Clicking buttons selects correct choice
- [x] Pressing number keys (1, 2, 3) selects correct choice
- [x] Game logic applies correct effects
- [x] No console errors
- [x] Works with keyboard shortcuts
- [x] Works with mouse clicks

## Example Scenarios

### Scenario 1: "The Spark" Event
**Original Order:**
1. Quit your job and go all-in
2. Keep your job, work nights/weekends
3. Find a co-founder first

**After Shuffle (Random Example):**
1. Find a co-founder first
2. Quit your job and go all-in
3. Keep your job, work nights/weekends

**Result:** Player must read each option instead of blindly pressing "2"

### Scenario 2: Multiple Plays
- **Play 1**: Event shows choices in order [C, A, B]
- **Play 2**: Same event shows choices in order [B, C, A]
- **Play 3**: Same event shows choices in order [A, B, C]

**Result:** No two playthroughs are identical, increasing replay value

## Impact on Strategy Guides

Previous strategy guides that said "press these numbers in order" are now **obsolete**. Players must:
1. Read each choice carefully
2. Understand the hints (resource effects)
3. Make informed decisions based on current game state
4. Adapt strategy based on what options appear

This makes the game more engaging and educational about real startup decision-making!

