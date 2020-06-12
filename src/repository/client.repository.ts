// const mysql = require("../database/database.config");
import mysql from 'mysql2';
var myDate = new Date();

exports.addClient = (model) => {

  return mysql.query(
    `INSERT INTO CLIENT (
            UserName,
            Password,
            CreatedDate
            )
     values (?,?,?)`,
    [
      model.userName,
      model.password,
      myDate
    ]
  )

};