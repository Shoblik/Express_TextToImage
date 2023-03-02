var mysql = require('mysql');

console.log('attempting to connect');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "text_to_image"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;