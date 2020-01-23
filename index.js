const express = require("express");
const app = express();

const { getImages, addImage, getImage, getComments, addComment } = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(express.static("./public"));

app.use(express.json());

// copied from lesson notes: -----------------------------------------
// ///////// BOILERPLATE CODE FOR IMAGE UPLOAD ///// DO NOT TOUCH /////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
// /////////////////////////////////////////////////////////////////

app.get("/images", (req, res) => {
    getImages()
        .then(images => {
            // console.log('images in getImages index.js: ', images);
            res.json(images);
        })
        .catch(err => {
            console.log("err in GET /images: ", err);
        });
});

app.get("/image/:id", (req, res) => {
    // console.log('req.params.id: ', req.params.id);
    getImage(req.params.id)
        .then(image => {
            // console.log("image: ", image[0]);
            res.json(image[0]);
        })
        .catch(err => {
            console.log("err in GET /image/:id: ", err);
        });
});

app.get("/comments/:id", (req, res) => {
    // console.log('req.params.id: ', req.params.id);
    getComments(req.params.id)
        .then(comments => {
            // console.log("comments: ", comments);
            res.json(comments);
        })
        .catch(err => {
            console.log("err in GET /comments/:id: ", err);
        });
});

app.post("/comment/:id", (req, res) => {
    // console.log('req.params.id: ', req.params.id);
    // console.log('req.body: ', req.body);
    addComment(req.body.comment, req.body.username, req.params.id)
        .then(comment => {
            console.log("comment: ", comment);
            res.json(comment);
        })
        .catch(err => {
            console.log("err in POST /comment/:id: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // insert a new row into the database for the images:
    // title, description, and username are in req.body
    const imageUrl = s3Url + req.file.filename;
    const username = req.body.username;
    const title = req.body.title;
    const description = req.body.description;
    // url of image: https://s3.amazonaws.com/name-of-bucket/filename
    addImage(imageUrl, username, title, description)
        .then(image => {
            // console.log('image after addImage(): ', image);
            // after query is successful, send a response
            res.json(image);
        })
        .catch(err => {
            console.log("err in POST /upload", err);
        });
});
// app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
//     console.log('file: ', req.file);
//     console.log('text-input: ', req.body);
//     if (req.file) {
//         res.json({
//             success: true
//         });
//     } else {
//         res.json({
//             success: false
//         });
//     }
// });

app.listen(8080, () => console.log("port 8080 listening!"));
