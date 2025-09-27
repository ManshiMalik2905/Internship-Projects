const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/submit", (req, res) => {
    const { name, email, phone, address, comments } = req.body;
    res.render("submit", { name, email, phone, address, comments });
});

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
