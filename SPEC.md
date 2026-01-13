# Spelling Bee Game - Technical Specification

## Overview

A fun, relaxed spelling bee game designed for kids starting at kindergarten level. The game speaks words aloud, provides context through sentences, and lets players type letters into individual boxes. No timers, no pressure - just learning through play.

---

## Core Gameplay

### Game Flow

1. **Word Presentation**
   - Game announces: "Spell the word: [WORD]"
   - Game reads a sentence using the word in context
   - Empty letter boxes appear (one per letter)

2. **Player Input**
   - Player types into letter boxes (one letter per box)
   - Tab/Enter advances to next box
   - Backspace moves to previous box
   - Each letter is spoken aloud as it appears

3. **Feedback**
   - **Correct letter**: Box highlights green, letter stays visible
   - **Incorrect letter**: Box highlights red briefly, letter is cleared, box ready for retry
   - Player can retry incorrect letters unlimited times

4. **Word Completion**
   - All correct: Celebration animation + sound + points awarded
   - Move to next word automatically after brief celebration

5. **Help System**
   - "Help Me" button available at all times
   - When pressed:
     - Remaining letters are revealed one-by-one (spoken aloud)
     - No points awarded for helped letters
     - Word is marked for reshuffling later in the session
     - Player doesn't need to type anymore for this word

### Scoring

- **Full word correct (no help)**: 10 points × level multiplier
- **Partial help used**: Points only for letters typed before help
- **Level multiplier**: Level 1 = 1x, Level 2 = 1.5x, Level 3 = 2x, etc.

### Level Progression

- Each level contains 8-12 words
- Complete all words to advance to next level
- Reshuffled "help" words appear at end of level
- Must complete reshuffled words to advance (but they can use help again)

---

## User Interface

### Design Principles

- **Light and Clean**: White/cream backgrounds, soft shadows, rounded corners
- **Fun and Friendly**: Playful fonts, cheerful colors, gentle animations
- **Kid-Friendly**: Large touch targets, clear visual hierarchy, minimal text
- **No Pressure**: No timers, no countdown, no rushing

### Screens

#### 1. Title Screen
```
+------------------------------------------+
|                                          |
|        [Magic wand / Rocket icon]        |
|                                          |
|         SPELLING BEE ADVENTURE           |
|                                          |
|    +--------------------------------+    |
|    |     Choose Your Adventure      |    |
|    +--------------------------------+    |
|                                          |
|    [Fantasy Kingdom]  [Space Explorer]   |
|                                          |
|           [Continue Game]                |
|           (if save exists)               |
|                                          |
+------------------------------------------+
```

#### 2. Level Select Screen
```
+------------------------------------------+
|  [Back]              Theme Name    [?]   |
|                                          |
|  Level 1: The Beginning     [3 stars]    |
|  Level 2: Growing Stronger  [2 stars]    |
|  Level 3: Getting Tricky    [locked]     |
|  ...                                     |
|                                          |
|  Total Score: 450 points                 |
|                                          |
+------------------------------------------+
```

#### 3. Game Screen
```
+------------------------------------------+
|  [Back]     Level 2      Score: 120      |
|                                          |
|         Word 3 of 10                     |
|                                          |
|    +----------------------------------+  |
|    |                                  |  |
|    |    [Speaker Icon]                |  |
|    |    "Spell the word: CASTLE"      |  |
|    |                                  |  |
|    |    "The princess lived in a     |  |
|    |     beautiful castle."          |  |
|    |                                  |  |
|    +----------------------------------+  |
|                                          |
|      +---+---+---+---+---+---+           |
|      | C | A | S | T |   |   |           |
|      +---+---+---+---+---+---+           |
|        ✓   ✓   ✓   ✓                     |
|                                          |
|    [Hear Again]           [Help Me]      |
|                                          |
+------------------------------------------+
```

#### 4. Celebration Modal
```
+------------------------------------------+
|                                          |
|              [Star burst]                |
|                                          |
|            WONDERFUL!                    |
|                                          |
|            +10 points                    |
|                                          |
|         [Continue Button]                |
|                                          |
+------------------------------------------+
```

### Color Palette

```
Primary Background:    #FFF9F0 (warm cream)
Card Background:       #FFFFFF (white)
Primary Accent:        #6C63FF (friendly purple)
Success Green:         #4CAF50 (correct letters)
Error Red:             #FF6B6B (incorrect, soft red)
Text Primary:          #2D3436 (dark gray)
Text Secondary:        #636E72 (medium gray)

Fantasy Theme Accent:  #9C27B0 (royal purple)
Sci-Fi Theme Accent:   #00BCD4 (cyan)
```

### Typography

- **Headings**: "Fredoka One" or "Baloo 2" (playful, rounded)
- **Body/UI**: "Nunito" or "Quicksand" (friendly, readable)
- **Letter Boxes**: "Fredoka One" (large, clear)

---

## Audio System

### Text-to-Speech (TTS)

**Primary: Web Speech API with Enhanced Voices**

```javascript
// Voice selection priority (most natural sounding)
const preferredVoices = [
  'Google UK English Female',      // Chrome - very natural
  'Google US English',             // Chrome - natural
  'Samantha',                      // Safari/macOS - excellent
  'Microsoft Aria Online',         // Edge - natural
  'Microsoft Jenny Online',        // Edge - natural
  'Karen',                         // Safari/macOS
  'Daniel',                        // Safari/macOS
];

// Fallback: any English voice available
```

**Speech Settings for Kids:**
```javascript
{
  rate: 0.85,      // Slightly slower for comprehension
  pitch: 1.1,      // Slightly higher, friendlier
  volume: 1.0
}
```

**For spelling out letters:**
```javascript
{
  rate: 0.7,       // Slower for letter-by-letter
  pitch: 1.0,
  volume: 1.0
}
```

### Sound Effects

Simple, cheerful sounds (Web Audio API or audio files):
- `correct.mp3` - Gentle "ding" for correct letter
- `incorrect.mp3` - Soft "boop" for incorrect (not harsh)
- `complete.mp3` - Celebration fanfare for word completion
- `levelup.mp3` - Achievement sound for level completion
- `click.mp3` - UI button feedback

---

## Data Architecture

### Word List Format (YAML)

```yaml
# words/fantasy.yaml
theme:
  id: fantasy
  name: "Fantasy Kingdom"
  icon: "magic-wand"
  description: "Explore a magical world of dragons and wizards!"

levels:
  - level: 1
    name: "The Enchanted Forest"
    description: "Simple magic awaits!"
    stars_required: 0
    words:
      - word: "cat"
        sentence: "The wizard's cat had orange fur."
      - word: "dog"
        sentence: "A friendly dog guarded the castle gate."
      - word: "hat"
        sentence: "The witch wore a pointy black hat."
      - word: "sun"
        sentence: "The sun rose over the magical kingdom."
      - word: "map"
        sentence: "The hero followed the treasure map."
      - word: "cup"
        sentence: "The fairy drank from a tiny cup."
      - word: "bed"
        sentence: "The princess slept in a golden bed."
      - word: "red"
        sentence: "The dragon had red scales."

  - level: 2
    name: "The Castle Gates"
    description: "Longer words ahead!"
    stars_required: 1
    words:
      - word: "king"
        sentence: "The kind king ruled the land."
      - word: "wand"
        sentence: "The wizard waved his magic wand."
      - word: "gold"
        sentence: "The treasure chest was full of gold."
      - word: "ring"
        sentence: "The magic ring granted one wish."
      - word: "frog"
        sentence: "The frog turned into a prince."
      - word: "moon"
        sentence: "The moon glowed silver at night."
      - word: "tree"
        sentence: "An elf lived in the tall tree."
      - word: "star"
        sentence: "She wished upon a falling star."

  - level: 3
    name: "The Dragon's Lair"
    description: "Brave spellers only!"
    stars_required: 2
    words:
      - word: "magic"
        sentence: "The spell required powerful magic."
      - word: "crown"
        sentence: "The queen wore a jeweled crown."
      - word: "sword"
        sentence: "The knight drew his shiny sword."
      - word: "fairy"
        sentence: "A tiny fairy flew past the window."
      - word: "stone"
        sentence: "The secret door was made of stone."
      - word: "tower"
        sentence: "The wizard lived in a tall tower."
      - word: "dream"
        sentence: "It felt like a wonderful dream."
      - word: "brave"
        sentence: "Only the brave could enter the cave."

  - level: 4
    name: "The Wizard's Library"
    description: "Ancient words of power!"
    stars_required: 3
    words:
      - word: "castle"
        sentence: "The castle stood on a misty hill."
      - word: "dragon"
        sentence: "The dragon breathed orange fire."
      - word: "knight"
        sentence: "A brave knight rode into battle."
      - word: "prince"
        sentence: "The prince searched for adventure."
      - word: "potion"
        sentence: "The witch brewed a bubbling potion."
      - word: "forest"
        sentence: "Magical creatures lived in the forest."
      - word: "secret"
        sentence: "She discovered a secret passage."
      - word: "goblin"
        sentence: "A sneaky goblin hid behind the rock."

  - level: 5
    name: "The Enchanted Realm"
    description: "Master level spells!"
    stars_required: 4
    words:
      - word: "kingdom"
        sentence: "Peace returned to the kingdom at last."
      - word: "princess"
        sentence: "The princess was kind to everyone."
      - word: "treasure"
        sentence: "They found the hidden treasure."
      - word: "magical"
        sentence: "The garden was truly magical."
      - word: "unicorn"
        sentence: "A white unicorn appeared in the meadow."
      - word: "enchant"
        sentence: "The spell would enchant the mirror."
      - word: "monster"
        sentence: "The monster was actually friendly."
      - word: "mystery"
        sentence: "They solved the ancient mystery."
```

```yaml
# words/scifi.yaml
theme:
  id: scifi
  name: "Space Explorer"
  icon: "rocket"
  description: "Blast off to spelling adventure in outer space!"

levels:
  - level: 1
    name: "Launch Pad"
    description: "Prepare for takeoff!"
    stars_required: 0
    words:
      - word: "sun"
        sentence: "The sun is a giant star."
      - word: "jet"
        sentence: "The jet flew very fast."
      - word: "sky"
        sentence: "Rockets launch into the sky."
      - word: "dot"
        sentence: "Earth looked like a tiny dot from space."
      - word: "zip"
        sentence: "The spaceship would zip past the moon."
      - word: "pod"
        sentence: "The astronaut climbed into the pod."
      - word: "map"
        sentence: "The star map showed many planets."
      - word: "red"
        sentence: "Mars is called the red planet."

  - level: 2
    name: "Orbital Station"
    description: "Welcome aboard!"
    stars_required: 1
    words:
      - word: "ship"
        sentence: "The space ship had big windows."
      - word: "moon"
        sentence: "The moon orbits Earth."
      - word: "star"
        sentence: "Every star is a distant sun."
      - word: "crew"
        sentence: "The crew worked together."
      - word: "fuel"
        sentence: "The rocket needed more fuel."
      - word: "land"
        sentence: "The probe will land on Mars."
      - word: "beam"
        sentence: "A laser beam lit up the dark."
      - word: "zoom"
        sentence: "Watch the comet zoom past!"

  - level: 3
    name: "Asteroid Belt"
    description: "Navigate carefully!"
    stars_required: 2
    words:
      - word: "space"
        sentence: "Space is dark and quiet."
      - word: "orbit"
        sentence: "Satellites orbit the Earth."
      - word: "laser"
        sentence: "The laser cut through metal."
      - word: "alien"
        sentence: "The friendly alien waved hello."
      - word: "comet"
        sentence: "The comet had a glowing tail."
      - word: "radar"
        sentence: "The radar detected something moving."
      - word: "pilot"
        sentence: "The pilot steered the ship safely."
      - word: "blast"
        sentence: "The rocket engines fired with a blast."

  - level: 4
    name: "Deep Space"
    description: "Into the unknown!"
    stars_required: 3
    words:
      - word: "rocket"
        sentence: "The rocket launched at sunrise."
      - word: "planet"
        sentence: "Jupiter is a giant planet."
      - word: "cosmos"
        sentence: "The cosmos is vast and beautiful."
      - word: "engine"
        sentence: "The engine hummed quietly."
      - word: "galaxy"
        sentence: "Our galaxy has billions of stars."
      - word: "voyage"
        sentence: "The voyage would take many years."
      - word: "meteor"
        sentence: "A meteor streaked across the sky."
      - word: "oxygen"
        sentence: "Astronauts need oxygen to breathe."

  - level: 5
    name: "New Horizons"
    description: "Final frontier!"
    stars_required: 4
    words:
      - word: "mission"
        sentence: "The mission was a great success."
      - word: "explore"
        sentence: "Humans love to explore new places."
      - word: "gravity"
        sentence: "There is less gravity on the moon."
      - word: "station"
        sentence: "The space station floated in orbit."
      - word: "captain"
        sentence: "The captain gave the order to launch."
      - word: "asteroid"
        sentence: "The asteroid tumbled through space."
      - word: "computer"
        sentence: "The computer calculated the route."
      - word: "universe"
        sentence: "The universe is full of wonders."
```

### Save State (localStorage)

```javascript
// Key: 'spellingBee_saveState'
{
  version: 1,
  lastPlayed: "2024-01-15T10:30:00Z",

  themes: {
    fantasy: {
      currentLevel: 2,
      totalScore: 340,
      levels: {
        1: {
          completed: true,
          score: 180,
          stars: 3,           // 3 = perfect, 2 = good, 1 = completed
          wordsHelped: []     // words where help was used
        },
        2: {
          completed: false,
          score: 160,
          stars: 0,
          currentWordIndex: 4,
          wordsHelped: ["sword"],
          reshuffleQueue: ["sword"]  // words to repeat
        }
      }
    },
    scifi: {
      currentLevel: 1,
      totalScore: 0,
      levels: {}
    }
  },

  settings: {
    soundEnabled: true,
    speechEnabled: true,
    speechRate: 0.85
  }
}
```

---

## Technical Implementation

### Tech Stack

- **Framework**: Vanilla JavaScript or lightweight framework (Preact/Svelte)
- **Bundler**: Vite (fast, simple)
- **Styling**: CSS with CSS Variables (no heavy frameworks)
- **Audio**: Web Speech API + HTML5 Audio
- **Storage**: localStorage
- **Data**: YAML files loaded via fetch (js-yaml parser)

### Project Structure

```
spelling-bee/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js              # Entry point
│   ├── app.js               # Main app controller
│   ├── styles/
│   │   ├── main.css         # Global styles
│   │   ├── variables.css    # CSS variables
│   │   ├── animations.css   # Animations
│   │   └── components.css   # Component styles
│   ├── components/
│   │   ├── TitleScreen.js
│   │   ├── LevelSelect.js
│   │   ├── GameScreen.js
│   │   ├── LetterBox.js
│   │   ├── CelebrationModal.js
│   │   └── HelpButton.js
│   ├── services/
│   │   ├── speech.js        # TTS wrapper
│   │   ├── audio.js         # Sound effects
│   │   ├── storage.js       # localStorage wrapper
│   │   └── wordLoader.js    # YAML loading
│   └── utils/
│       └── helpers.js
├── words/
│   ├── fantasy.yaml
│   └── scifi.yaml
├── audio/
│   ├── correct.mp3
│   ├── incorrect.mp3
│   ├── complete.mp3
│   ├── levelup.mp3
│   └── click.mp3
└── assets/
    ├── icons/
    └── images/
```

### Key Components

#### Speech Service

```javascript
// src/services/speech.js
class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.initVoice();
  }

  async initVoice() {
    // Wait for voices to load
    await new Promise(resolve => {
      if (this.synth.getVoices().length) {
        resolve();
      } else {
        this.synth.onvoiceschanged = resolve;
      }
    });

    const voices = this.synth.getVoices();
    const preferred = [
      'Google UK English Female',
      'Google US English',
      'Samantha',
      'Microsoft Aria Online',
    ];

    for (const name of preferred) {
      this.voice = voices.find(v => v.name.includes(name));
      if (this.voice) break;
    }

    // Fallback to any English voice
    if (!this.voice) {
      this.voice = voices.find(v => v.lang.startsWith('en'));
    }
  }

  speak(text, options = {}) {
    return new Promise(resolve => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.rate = options.rate || 0.85;
      utterance.pitch = options.pitch || 1.1;
      utterance.onend = resolve;
      this.synth.speak(utterance);
    });
  }

  speakWord(word) {
    return this.speak(`Spell the word: ${word}`, { rate: 0.85 });
  }

  speakSentence(sentence) {
    return this.speak(sentence, { rate: 0.85 });
  }

  speakLetter(letter) {
    return this.speak(letter.toUpperCase(), { rate: 0.7, pitch: 1.0 });
  }
}
```

#### Letter Box Component

```javascript
// src/components/LetterBox.js
class LetterBox {
  constructor(index, correctLetter, onInput) {
    this.index = index;
    this.correctLetter = correctLetter.toLowerCase();
    this.onInput = onInput;
    this.element = this.render();
    this.isCorrect = false;
  }

  render() {
    const box = document.createElement('div');
    box.className = 'letter-box';
    box.innerHTML = `
      <input
        type="text"
        maxlength="1"
        autocomplete="off"
        autocapitalize="off"
      />
    `;

    const input = box.querySelector('input');
    input.addEventListener('input', (e) => this.handleInput(e));
    input.addEventListener('keydown', (e) => this.handleKeydown(e));

    return box;
  }

  handleInput(e) {
    const value = e.target.value.toLowerCase();

    if (value === this.correctLetter) {
      this.markCorrect(value);
      this.onInput({ correct: true, letter: value, index: this.index });
    } else if (value) {
      this.markIncorrect();
      this.onInput({ correct: false, letter: value, index: this.index });
    }
  }

  markCorrect(letter) {
    this.isCorrect = true;
    this.element.classList.add('correct');
    this.element.querySelector('input').value = letter.toUpperCase();
    this.element.querySelector('input').disabled = true;
  }

  markIncorrect() {
    this.element.classList.add('incorrect');
    setTimeout(() => {
      this.element.classList.remove('incorrect');
      this.element.querySelector('input').value = '';
      this.element.querySelector('input').focus();
    }, 300);
  }

  reveal() {
    this.markCorrect(this.correctLetter);
  }

  focus() {
    this.element.querySelector('input').focus();
  }
}
```

### CSS Animation Examples

```css
/* Correct letter animation */
.letter-box.correct {
  animation: correctPop 0.3s ease-out;
  background: linear-gradient(135deg, #4CAF50, #81C784);
  border-color: #4CAF50;
}

@keyframes correctPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Incorrect letter animation */
.letter-box.incorrect {
  animation: incorrectShake 0.3s ease-out;
  background: linear-gradient(135deg, #FF6B6B, #FF8A8A);
  border-color: #FF6B6B;
}

@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Celebration animation */
@keyframes celebrate {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.celebration-modal {
  animation: celebrate 0.5s ease-out;
}

/* Star burst particles */
.star-particle {
  position: absolute;
  animation: starBurst 1s ease-out forwards;
}

@keyframes starBurst {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
```

---

## Accessibility

- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Backspace, Escape)
- **Screen Reader**: ARIA labels on all interactive elements
- **Visual**: High contrast mode available, large text option
- **Audio**: Visual indicators accompany all audio feedback
- **Motor**: Large click/touch targets (minimum 44x44px)

---

## Mobile Support

- Responsive design works on tablets and phones
- Touch-friendly letter boxes
- On-screen keyboard works with input boxes
- Portrait and landscape orientations supported
- Minimum supported width: 320px

---

## Future Enhancements (Out of Scope for v1)

- Additional themes (Ocean Adventure, Dinosaur World, etc.)
- Custom word lists (parents can add words)
- Multiplayer mode (take turns spelling)
- Achievement badges
- Difficulty settings per user
- Progress sharing with parents

---

## Success Metrics

- Kids can play independently after brief introduction
- Average session length: 10-15 minutes
- Zero frustration quits (thanks to help system)
- Parents report improved spelling confidence

---

## Summary

This spelling bee game prioritizes **fun over pressure**. With no timers, unlimited retries, and a helpful hint system, kids can learn at their own pace. The themed word lists (Fantasy and Sci-Fi) make learning engaging, while browser-based saves let them pick up where they left off. Natural-sounding voices and cheerful feedback create a positive learning environment.
