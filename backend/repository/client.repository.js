const mysql = require("../database/database.config");
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