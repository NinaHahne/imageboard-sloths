const express = require("express");
const app = express();

const { getImages } = require("./db");

app.use(express.static("./public"));

app.use(
    express.json()
);

app.get('/images', (req, res) => {
    getImages().then(images => {
        // console.log('images in getImages index.js: ', images);
        res.json(images);
    });
});

app.listen(8080, () =>
    console.log("port 8080 listening!")
);
