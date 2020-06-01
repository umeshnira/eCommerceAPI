const mysql = require("../database/database.config");

exports.getAllProduct = (res) => {

  return mysql.execute(
      `SELECT * FROM product `
    )
    .then((rows, err) => {
      res.send(JSON.stringify(rows[0])) ? rows : res.end(err);
    });

}

exports.getProductById = (req, res) => {

  return mysql.execute(
      `SELECT * FROM product where ProductId=?`,
      [
        req.params.id,
      ])
    .then((rows, err) => {
      res.send(JSON.stringify(rows[0])) ? rows : res.send(err);
    });

}

exports.deleteProductById = (req) => {

  return mysql.execute(
    `DELETE FROM  product where ProductID=?`,
    [
      req.params.id
    ]
  )


};

exports.addProduct = (model, res) => {

  return mysql.execute(
    `INSERT INTO product (
        SubProductTypeId,
        ProductName,
        ProductDescription
        )
           values( ? , ? , ? )
           `,
    [
      model.subProductTypeId,
      model.productName,
      model.productDescription
    ]
  )

};

  exports.editProductById = (model, req) => {

    return mysql.execute(
      `UPDATE product set 
      ProductName =? , 
      ProductDescription =? 
      WHERE ProductId = ?`,
      [
        model.productName,
        model.productDescription,
        req.params.id
      ]
    )

  };