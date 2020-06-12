import mysql from 'mysql2';
const config = require('../config.json');

const pool = mysql.createConnection({
  host: config.dbSettings.host,
  user: config.dbSettings.user,
  password: config.dbSettings.password,
  database: config.dbSettings.database,
  multipleStatements: true,
});

pool.connect((err) => {
  if (!err) console.log("Connection Established Successfully");
  else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});

module.exports = pool.promise();
