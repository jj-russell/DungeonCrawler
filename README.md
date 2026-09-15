# DungeonCrawler

A web-based dungeon crawler game built with Flask and JavaScript. Battle through 5 increasingly challenging levels, defeat various enemy types, and compete on the leaderboard for the highest score.

## Table of Contents

- [Features](#features)
- [Game Overview](#game-overview)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Game](#running-the-game)
- [User System](#user-system)
- [Gameplay Mechanics](#gameplay-mechanics)
- [Leaderboard](#leaderboard)
- [File Structure](#file-structure)

## Features

✨ **User Authentication**

- Secure user registration and login system
- Password hashing with werkzeug security
- Session management with Flask-Session

🎮 **Interactive Gameplay**

- 5 progressively challenging levels
- Real-time canvas-based rendering at 30 FPS
- Multiple enemy types with unique behaviors
- Player health and stamina systems
- Invincibility frames (iFrames) system

👥 **Competitive Leaderboard**

- Global leaderboard ranking players
- Sorted by cheat status, score, and completion time
- Score tracking for each user
- Cheat detection and flagging

🎨 **Rich Visuals**

- Sprite-based enemy animations
- Player animation sequences
- Dungeon tileset graphics
- Sound effects and background music

## Game Overview

### Enemy Types

DungeonCrawler features six different enemy types, each appearing in increasingly difficult levels:

1. **Skeleton** (Level 1) - Basic enemy
2. **Archer** (Level 1+) - Ranged attacker
3. **Armoured Skeleton** (Level 2) - Tougher melee unit
4. **Armoured Archer** (Level 3) - Armored ranged enemy
5. **Paladin** (Level 4) - Strong armored warrior
6. **Mage** (Level 4) - Magic-based enemy
7. **Boss** (Level 5) - Final challenge

### Level Progression

| Level | Description      | Enemies                              |
| ----- | ---------------- | ------------------------------------ |
| 1     | Introduction     | Skeletons, Archers                   |
| 2     | Escalation       | Armoured Skeletons, Archers          |
| 3     | Advanced         | Armoured Skeletons, Armoured Archers |
| 4     | Boss Preparation | Paladins, Mages                      |
| 5     | Final Boss       | Boss, Paladins, Mages                |

## Technical Stack

**Backend:**

- **Framework**: Flask
- **Database**: SQLite3
- **Templates**: Jinja2
- **Forms**: Flask-WTF with WTForms
- **Security**: werkzeug.security (password hashing)
- **Session Management**: Flask-Session

**Frontend:**

- **HTML5 Canvas**: Game rendering
- **JavaScript (ES6+)**: Game logic and interactions
- **CSS3**: Styling and animations

## Project Structure

```
DungeonCrawler/
├── app.py                    # Main Flask application
├── run.py                    # CGI handler for deployment
├── database.py               # Database connection and management
├── forms.py                  # WTForms for login/registration
├── schema.sql                # SQLite database schema
├── static/                   # Static assets
│   ├── *.css                 # Stylesheets (core, game, etc.)
│   ├── index.js              # Main game logic
│   ├── levels.js             # Level definitions and enemy spawns
│   ├── audio/                # Sound effects and music
│   ├── fonts/                # Custom fonts
│   └── images/               # Game graphics
│       ├── enemies/          # Enemy sprite animations
│       ├── player_animations/# Player animations
│       ├── player_attack/    # Attack animations
│       └── stats/            # UI stat icons
└── templates/                # HTML templates
    ├── base.html             # Base template
    ├── index.html            # Main menu
    ├── game.html             # Game page
    ├── leaderboard.html      # Leaderboard view
    ├── login.html            # Login form
    ├── register.html         # Registration form
    ├── attribution.html      # Asset attributions
    └── tutorial.html         # Game tutorial
```

## Installation

### Prerequisites

- Python 3.11+
- pip (Python package installer)

### Setup

1. **Clone or navigate to the project directory:**

   ```bash
   cd /path/to/DungeonCrawler
   ```

2. **Create a virtual environment (recommended):**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

   Or manually:

   ```bash
   pip install flask flask-session flask-wtf wtforms werkzeug
   ```

4. **Initialize the database:**
   ```bash
   python3
   >>> from database import get_db
   >>> import sqlite3
   >>> conn = sqlite3.connect('app.db')
   >>> with open('schema.sql', 'r') as f:
   >>>     conn.executescript(f.read())
   >>> conn.commit()
   >>> conn.close()
   >>> exit()
   ```

### Requirements File

A `requirements.txt` file is included with all project dependencies and their versions. To install all dependencies at once, use:

```bash
pip install -r requirements.txt
```

To update the requirements file after installing new packages:

```bash
pip freeze > requirements.txt
```

## Running the Game

### Development Server

```bash
python3 -m flask run
```

The application will be available at `http://localhost:5000/`

### Production (CGI)

The `run.py` file is configured for CGI deployment. Configure your web server to execute it.

## User System

### Registration

- Usernames must be 10 characters or less
- Passwords must not be blank
- Passwords must match confirmation field
- Duplicate usernames are prevented

### Login

- Users must have an active account
- Passwords are verified using secure hashing
- Session persists across requests

### Account Features

- Secure password storage with werkzeug hashing
- Automatic leaderboard entry creation
- Session-based authentication with redirect on login required

## Gameplay Mechanics

### Player Stats

- **Health**: Default max of 5 HP
- **Stamina**: Default max of 5 SP
- **Invincibility Frames (iFrames)**: 45 frames of protection after taking damage

### Combat System

- Real-time collision detection
- Damage calculation based on enemy type
- Stamina consumption for actions
- Dungeon layout with doors that open/close

### Scoring System

- Score based on enemies defeated
- Time tracked in milliseconds
- Completion bonuses for speedruns
- Cheat detection flag (0 = clean, 1 = cheated)

## Leaderboard

### Ranking System

Players are ranked by:

1. **Cheat Status** (clean players ranked above cheaters)
2. **Score** (higher is better)
3. **Completion Time** (lower is better for same score)

### Score Updates

- Only updates if:
  - New score is higher than previous, OR
  - Same score but faster time, OR
  - First completion, OR
  - Cheats were removed (cheater becomes clean player)

### Viewing Leaderboard

Navigate to `/leaderboard` to view global rankings.

## API Endpoints

| Route          | Method    | Purpose                           |
| -------------- | --------- | --------------------------------- |
| `/`            | GET, POST | Main menu                         |
| `/register`    | GET, POST | User registration                 |
| `/login`       | GET, POST | User login                        |
| `/logout`      | GET       | User logout                       |
| `/game`        | GET, POST | Game area (auth required)         |
| `/store_score` | POST      | Submit game score (auth required) |
| `/leaderboard` | GET       | View leaderboard                  |
| `/attribution` | GET       | Asset attributions                |

## Features to Expand

Potential enhancements:

- [ ] Additional difficulty modes
- [ ] Achievements/badges system
- [ ] Multiplayer leaderboard filtering
- [ ] Custom player skins
- [ ] Power-ups and special items
- [ ] Boss-specific mechanics
- [ ] Replay system
- [ ] In-game tutorial progression

## Credits

This game features sprite animations and assets, with proper attribution provided in the game's attribution page.

## License

This project is provided as-is for educational and recreational purposes.

---

**Happy dungeon crawling!** 🐉⚔️
