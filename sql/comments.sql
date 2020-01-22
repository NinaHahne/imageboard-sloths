DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL CHECK (comment != ''),
    username VARCHAR NOT NULL CHECK (username != ''),
    img_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
