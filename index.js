// Add packages
require("dotenv").config();

const express = require("express");
const app = express();
const dblib = require("./dblib.js");
const multer = require("multer");
const upload = multer();

// Database URL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  },
  max: 2
});

// Setup EJS
app.set("view engine", "ejs");

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Application folders
app.use(express.static("public"));

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Starting the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Routes

// Homescreen "/"
app.get("/", (req, res) => {
  //res.send("Root resource - Up and running!")
  res.render("index");
});