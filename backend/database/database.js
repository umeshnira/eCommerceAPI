var mysql = require("mysql2");
var config = {};
config.db = {};

config.db.host = "localhost";
config.db.user = "root";
config.db.password = "cuteattitude";
config.db.database = "ecommerce";
const pool = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  multipleStatements: true,
});

pool.connect((err) => {
  if (!err) console.log("Connection Established Successfully");
  else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});
module.exports = pool.promise();
