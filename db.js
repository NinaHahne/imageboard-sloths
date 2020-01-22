const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db.query(`SELECT * FROM images ORDER BY id DESC`).then(({ rows }) => rows);
};

exports.addImage = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, username, title, description]
    ).then(({ rows }) => rows);
};

exports.getImage = function(id) {
    return db.query(`SELECT * FROM images WHERE id= $1`, [id]).then(({ rows }) => rows);
};

exports.getComments= function(img_id) {
    return db.query(`SELECT * FROM comments WHERE img_id=$1 ORDER BY id DESC`, [img_id]).then(({ rows }) => rows);
};

exports.addComment = function(comment, username, img_id) {
    return db.query(
        `INSERT INTO comments (comment, username, img_id)
        VALUES ($1, $2, $3) RETURNING *`,
        [comment, username, img_id]
    ).then(({ rows }) => rows);
};
