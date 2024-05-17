// Add packages
require("dotenv").config();
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 2
});

const getTotalRecords = () => {
    const sql = "SELECT COUNT(*) FROM customer";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                totRecords: result.rows[0].count
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

// Sum of series (start, end) divisible by a number. All of this is supposed to be user input, based off the /sseries page, but I'm having trouble displaying it on the page...
function sumOfDivis(start, end, divis) {
  let sum = 0;

  // Loop from start to end, defined by user
  for (let i = start; i < end; i++) {
    // Check if the number is divisible. Divis number is defined by user
    if (i % divis === 0) {
        // If divis, that number to sum
        sum += i;
    }
  }

  // Return the calculated sum
  return sum;
}

/* --- Below is code via JavaScript, but that is not the intention for this final. I was using this as guidance...need to use the HTML id of what the user enters -----

const start = parseInt(prompt("Enter the start of the series: "), 10);
const end = parseInt(prompt("Enter the end of the series: "), 10);
const divis = parseInt(prompt("Enter the divisible number: "), 10);

// Calculate the sum of numbers in the series divisible by the divisor
const result = sumOfDivis(start, end, divis);

// Display the result
console.log(`The sum of numbers in the series from ${start} to ${end} divisible by ${divis} is: ${result}`);
alert(`The sum of numbers in the series from ${start} to ${end} divisible by ${divis} is: ${result}`);

Sure, this function works, but I need to base this off of user input on the /sseries page. 
*/


// Add this to end
module.exports.getTotalRecords = getTotalRecords; // This should be giving us the # of total records...
module.exports.sumOfDivis = sumOfDivis; // This function gives us the sum of numbers divisible by a specific number