const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

let submissions = [];

// Render main form
app.get("/", (req, res) => {
  res.render("index");
});

// Render result page (after submit)
app.post("/submit", (req, res) => {
  const { name, email, password, phone, address, gender } = req.body;

  if (!name || !email || !password || !phone || !address || !gender) {
    return res.send("<h2>❌ All fields are required! <a href='/'>Go back</a></h2>");
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    return res.send("<h2>❌ Invalid Email! <a href='/'>Go back</a></h2>");
  }

  if (password.length < 8) {
    return res.send("<h2>❌ Password must be at least 8 characters long! <a href='/'>Go back</a></h2>");
  }

  const phonePattern = /^[0-9]{10}$/;
  if (!phone.match(phonePattern)) {
    return res.send("<h2>❌ Invalid Phone Number! <a href='/'>Go back</a></h2>");
  }

  submissions.push({ name, email, phone, address, gender });

  res.render("result", { name, email, phone, address, gender, submissions });
});

// API endpoints
app.get("/api/submissions", (req, res) => {
  res.json(submissions);
});

app.post("/api/submissions", (req, res) => {
  const { name, email, phone, address, gender } = req.body;
  if (!name || !email || !phone || !address || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }
  submissions.push({ name, email, phone, address, gender });
  res.status(201).json({ message: "Submission created", submission: req.body });
});

app.delete("/api/submissions/:index", (req, res) => {
  const idx = parseInt(req.params.index);
  if (idx >= 0 && idx < submissions.length) {
    const removed = submissions.splice(idx, 1);
    return res.json({ message: "Submission deleted", removed });
  }
  res.status(404).json({ error: "Submission not found" });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
