const mysql = require("../database/database.config");


exports.addClient = (model) => {


  return mysql.query(
    `INSERT INTO CLIENT (
            UserName,
            Password,
            IsDeleted
            )
     values (?,?,?)`,
    [
      model.userName,
      model.password,
      model.isDeleted
    ]

  )


};