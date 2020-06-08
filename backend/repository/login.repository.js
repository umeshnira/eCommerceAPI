const mysql = require("../database/database.config");

exports.addLoginDetails = (model, userId) => {

  return mysql.query(
    `INSERT INTO LOGIN (
                UserId,
                UserName,
                Password,
                Role,
                IsDeleted
                )
         values (?,?,?,?,?)`,
    [
      userId,
      model.email ? model.email : model.userName,
      model.password,
      model.role,
      model.isDeleted,
    ]
  )
}