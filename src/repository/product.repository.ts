// const mysql = require("../database/database.config");
// var myDate = new Date();

// exports.getAllProducts = () => {

//   return mysql.query(
//     `SELECT * FROM product `
//   )
// };

// exports.getProductById = (req) => {

//   return mysql.query(
//     `SELECT * FROM product where ProductId=?`,
//     [
//       req.params.id,
//     ])
// };

// exports.deleteProductById = (req) => {

//   return mysql.execute(
//     `DELETE FROM  product where ProductID=?`,
//     [
//       req.params.id
//     ]
//   )
// };

// exports.addProduct = (model) => {

//   return mysql.execute(
//     `INSERT INTO product (
//         SubProductTypeId,
//         ProductName,
//         ProductDescription,
//         CreatedDate
//         )
//            values( ? , ? , ?, ? )
//            `,
//     [
//       model.subProductTypeId,
//       model.productName,
//       model.productDescription,
//       myDate
//     ]
//   )
// };

// exports.editProductById = (model, req) => {

//   return mysql.execute(
//     `UPDATE product set 
//       ProductName =? , 
//       ProductDescription =? 
//       WHERE ProductId = ?`,
//     [
//       model.productName,
//       model.productDescription,
//       req.params.id
//     ]
//   )
// };