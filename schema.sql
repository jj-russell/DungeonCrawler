DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    user TEXT PRIMARY KEY,
    password TEXT NOT NULL
);

DROP TABLE IF EXISTS leaderboard;
CREATE TABLE leaderboard
(
    user TEXT PRIMARY KEY,
    score INTEGER NOT NULL,
    time INTEGER NOT NULL,
    cheats INTEGER NOT NULL,
    FOREIGN KEY (user) REFERENCES users(user)
);
