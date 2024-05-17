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
  res.render("index");
});

// Sum of Series
// I'm calling the function sumOfDivis...and I want it to use maybe document.getElementById()?
app.get("/sseries", (req, res) => {
  const ssum = dblib.sumOfDivis();

  res.render("sseries", {
    type: "get",
    ssum: ssum.totRecords
  });
});

// I need to return what the user inputed using the function
app.post("sseries",(req, res) => {
  const ssum = dblib.sumOfDivis();
})

// Import files to add customers to database
app.get("/import", async (req, res) => {
  const totRecs = await dblib.getTotalRecords();
  res.render("import", {
    type: "get",
    totRecs: totRecs.totRecords
  });
});

// Trouble showing the results at the bottom
app.post("/import", upload.single('filename'), async (req, res) => {
  const totRecs = await dblib.getTotalRecords();
   if(!req.file || Object.keys(req.file).length === 0) {
       let message = "Error: Import file not uploaded";
       return res.send(message);
   };
   //Read file line by line, inserting records
   const buffer = req.file.buffer; 
   const lines = buffer.toString().split(/\r?\n/);

   lines.forEach(line => {
        let product = line.split(",");
        const sql = "INSERT INTO evehicle(vid, vin, city, postal_code, model_year, make, model, ev_type, electric_range, base_msrp, purchase_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
        pool.query(sql, product, (err, result) => {
            if (err) {
                console.log(`Insert Error.  Error message: ${err.message}`);
            } else {
                console.log(`Inserted successfully`);
            }
       });
   });
   let message = `Processing Complete - Processed ${lines.length} records`;
   res.send(message);
});