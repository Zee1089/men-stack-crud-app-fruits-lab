const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const app = express();

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// Log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the Brain model
const Brain = require("./models/brain.js");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method')); // Method override middleware
app.use(express.static('public'));

// GET /template to render on the page> LANDING PAGE?
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /brains
app.get("/brains", async (req, res) => {
    const allBrains = await Brain.find();
    res.render("brains/index.ejs", { brains: allBrains });
});

// GET /brains/new to get the FORM
app.get("/brains/new", (req, res) => {
    res.render('brains/new.ejs');
});

// GET /brains/:brainId
app.get("/brains/:brainId", async (req, res) => {
    const foundBrain = await Brain.findById(req.params.brainId);
    res.render("brains/show.ejs", { brain: foundBrain });
});

// POST /brains
app.post("/brains", async (req, res) => {
  if (req.body.isBilateral === "on") {
    req.body.isBilateral = true;
  } else {
    req.body.isBilateral = false;
  }
  await Brain.create(req.body);
  res.redirect("/brains"); // redirect to index brains
});

// GET /brains/:brainId/edit
app.get("/brains/:brainId/edit", async (req, res) => {
    const foundBrain = await Brain.findById(req.params.brainId);
    res.render("brains/edit.ejs", { brain: foundBrain });
});

// DELETE /brains/:brainId
app.delete("/brains/:brainId", async (req, res) => {
  await Brain.findByIdAndDelete(req.params.brainId);
  res.redirect("/brains");
});

// PUT /brains/:brainId
app.put("/brains/:brainId", async (req, res) => {
    if (req.body.isBilateral === "on") {
      req.body.isBilateral = true;
    } else {
      req.body.isBilateral = false;
    }
    
    await Brain.findByIdAndUpdate(req.params.brainId, req.body);
    res.redirect(`/brains/${req.params.brainId}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// Example form in your EJS template for deleting a brain part
// <form action="/brains/<%= brain._id %>?_method=DELETE" method="POST">
//   <button type="submit">Delete</button>
// </form>
