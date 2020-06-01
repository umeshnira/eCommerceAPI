const mysql = require("../database/database.config");
const authController = require('../controllers/auth.controller')

exports.addLoginDetails = (model) => {

    let userId = authController.insertId;
    return mysql.query (
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