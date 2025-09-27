const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Temporary storage (in-memory)
let submissions = [];

// Show form
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission with server-side validation
app.post("/submit", (req, res) => {
  const { name, email, phone, address, gender } = req.body;

  if (!name || !email || !phone || !address || !gender) {
    return res.send("<h2>❌ All fields are required! <a href='/'>Go back</a></h2>");
  }

  // Email validation
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    return res.send("<h2>❌ Invalid Email! <a href='/'>Go back</a></h2>");
  }

  // Phone validation
  const phonePattern = /^[0-9]{10}$/;
  if (!phone.match(phonePattern)) {
    return res.send("<h2>❌ Invalid Phone Number! <a href='/'>Go back</a></h2>");
  }

  // Store data temporarily
  submissions.push({ name, email, phone, address, gender });

  res.render("result", { name, email, phone, address, gender });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
