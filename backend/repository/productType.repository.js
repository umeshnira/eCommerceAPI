const mysql = require("../database/database.config");
var date = new Date();

exports.getAllProductTypes = () => {

  return mysql.execute(
    `SELECT * FROM product_type `
  )
};

exports.getProductTypeById = (req) => {

  return mysql.execute(
    `SELECT * FROM product_type where ProductTypeID=?`,
    [
      req.params.id,
    ]
  )
};

exports.deleteProductTypeById = (req) => {

  return mysql.execute(
    `DELETE FROM  product_type where ProductTypeID=?`,
    [
      req.params.id
    ]
  )
};

exports.addProductType = (model) => {

  return mysql.query(
    `INSERT INTO product_type (
        ProductTypeName,
        ProductTypeDescription,
        CreatedDate
        )
           values (?,?,?)`,
    [
      model.productTypeName,
      model.productTypeDescription,
      date
    ]
  )
};

exports.editProductTypeById = (model, req) => {

  return mysql.execute(
    `UPDATE product_type set 
      ProductTypeName =? , 
      ProductTypeDescription =? 
      WHERE ProductTypeId = ?`,
    [
      model.productTypeName,
      model.productTypeDescription,
      req.params.id
    ]
  )
};