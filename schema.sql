DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    user TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    score INTEGER,
    time INTEGER
);

update users set score = 0, time = 0;