# DungeonCrawler

A web-based dungeon crawler game built with Flask and JavaScript. Battle through 5 increasingly challenging levels, defeat various enemy types, and compete on the leaderboard for the highest score.

## Features

- **User Authentication** - Secure registration and login
- **5 Levels** - Progressively challenging gameplay with multiple enemy types
- **Real-time Gameplay** - Canvas-based rendering at 30 FPS
- **Leaderboard** - Global rankings sorted by score and completion time
- **Score Tracking** - Track your best scores with cheat detection

## Quick Start

### Prerequisites

- Python 3.11+
- pip

### Installation

1. **Navigate to the project directory:**

   ```bash
   cd /path/to/DungeonCrawler
   ```

2. **Create and activate a virtual environment (optional):**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

### Run the Game

```bash
python3 -m flask run
```

Open your browser and navigate to `http://localhost:5000/`

## How to Play

1. **Register** - Create a new account with a username and password
2. **Login** - Sign in to your account
3. **Start Game** - Battle through 5 levels of increasing difficulty
4. **View Leaderboard** - Check your ranking against other players
