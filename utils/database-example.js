var mysql = require('mysql');

console.log('attempting to connect');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "",
    database: "text_to_image",
    debug: false
});

pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = pool;