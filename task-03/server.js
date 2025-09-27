const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

let submissions = [];


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", (req, res) => {
  const { name, email, phone, address, gender } = req.body;

  if (!name || !email || !phone || !address || !gender) {
    return res.send("<h2>❌ All fields are required! <a href='/'>Go back</a></h2>");
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    return res.send("<h2>❌ Invalid Email! <a href='/'>Go back</a></h2>");
  }

  const phonePattern = /^[0-9]{10}$/;
  if (!phone.match(phonePattern)) {
    return res.send("<h2>❌ Invalid Phone Number! <a href='/'>Go back</a></h2>");
  }

  submissions.push({ name, email, phone, address, gender });

  res.render("result", { name, email, phone, address, gender });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
