-- Active: 1698751134265@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    user_role VARCHAR(6) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);

INSERT INTO users (id, name, email, password, user_role, created_at)
VALUES ('u001', 'Lucas', 'lucas@email.com', '$2a$12$fSHlbNpAXlsC37uEEAsbP.wae2h0NFyLo11XtO0ii0FMTGff58Bj2', ' ADMIN',  '2023-09-29 12:10:32');

INSERT INTO users (id, name, email, password, user_role, created_at)
VALUES ('u002', 'Nruna', 'bruna@email.com', '$2a$12$fSHlbNpAXlsC37uEEAsbP.wae2h0NFyLo11XtO0ii0FMTGff58Bj2', 'NORMAL', '2023-09-30 15:02:32');

INSERT INTO users (id, name, email, password, user_role, created_at)
VALUES ('u003', 'Gilvan', 'gilvan@email.com', '$2a$12$fSHlbNpAXlsC37uEEAsbP.wae2h0NFyLo11XtO0ii0FMTGff58Bj2', 'NORMAL', '2023-09-29 12:10:32');

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    comments INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
); 

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    likes INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE comments(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
     updated_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE comments_likes_dislikes(
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    likes INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

DROP TABLE users;
DROP TABLE posts;
DROP TABLE likes_dislikes;
DROP TABLE comments;
DROP TABLE comments_likes_dislikes;