const express = require("express");
const app = express();

app.use(express.static("./public"));

app.use(
    express.json()
);

app.get('/candy', (req, res) => {
    res.json([
        {name: 'maltesers'},
        {name: 'happy cherries'},
        {name: 'milka'}
    ]);
});

app.listen(8080, () =>
    console.log("port 8080 listening!")
);
