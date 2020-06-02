const mysql = require("../database/database.config");

exports.getAllProductCategories = () => {

  return mysql.execute(
      `SELECT * FROM product_type `
    )

}

exports.getProductCategoryById = (req) => {

  return mysql.execute(
      `SELECT * FROM product_type where ProductTypeID=?`,
      [
        req.params.id,
      ])

}

exports.deleteProductCategoryById = (req) => {

   return mysql.execute(
       `DELETE FROM  product_type where ProductTypeID=?`,
       [
         req.params.id
       ])

};

exports.addProductCategory = (model) => {

    return mysql.query(
      `INSERT INTO product_type (
        ProductTypeName,
        ProductTypeDescription
        )
           values (?,?)`,
      [
        model.name,
        model.description
      ]
    )
  
  };

  exports.editProductCategoryById = (model, req) => {

    return mysql.execute(
      `UPDATE product_type set 
      ProductTypeName =? , 
      ProductTypeDescription =? 
      WHERE ProductTypeId = ?`,
      [
        model.name,
        model.description,
        req.params.id
      ])

  };