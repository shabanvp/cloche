const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",          // change if needed
  password: "shabansabu",          // your MySQL password
  database: "cloche"
});

module.exports = db;
