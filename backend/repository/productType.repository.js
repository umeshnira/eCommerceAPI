const mysql = require("../database/database.config");

exports.getAllProductCategories = (res) => {

  return mysql.execute(
      `SELECT * FROM product_type `
    )
    .then((rows, err) => {
      res.send(JSON.stringify(rows[0])) ? rows : res.end(err);
    });

}

exports.getProductCategoryById = (req, res) => {

  return mysql.execute(
      `SELECT * FROM product_type where ProductTypeID=?`,
      [
        req.params.id,
      ])
    .then((rows, err) => {
      res.send(JSON.stringify(rows[0])) ? rows : res.send(err);
    });

}

exports.deleteProductCategoryById = (req,res) => {

   return mysql.execute(
       `DELETE FROM  product_type where ProductTypeID=?`,
       [
         req.params.id
       ])
     .then((rows, err) => {
       res.send(err) ? err : res.send('Deleted product category successfully');
     });

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