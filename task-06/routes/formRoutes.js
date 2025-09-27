const express = require("express");
const FormData = require("../models/FormData");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// Show form (only logged in users)
router.get("/", authMiddleware, (req, res) => {
    res.render("index");
});

// Handle form submission
router.post("/submit", authMiddleware, async (req, res) => {
    try {
        const formData = new FormData(req.body);
        await formData.save();
        res.render("result", { data: req.body });
    } catch (err) {
        res.send("Error saving form: " + err.message);
    }
});

module.exports = router;
