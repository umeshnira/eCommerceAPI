var mysql = require("../database/database");
exports.getProductCategory = (req, res) => {
  mysql.execute(`SELECT * FROM product_type `).then((rows, err) => {
    if (err) {
      res.send(err);
    } else {
      res.end(JSON.stringify(rows[0]));
    }
    res.end();
  });
};
exports.getProductCategoryById = (req, res) => {
  mysql
    .execute(`SELECT * FROM product_type where ProductTypeID=?`, [
      req.params.id,
    ])
    .then((rows, err) => {
      if (err) {
        res.send(err);
      } else {
        res.end(JSON.stringify(rows[0]));
      }
      res.end();
    });
};
exports.deleteProductCategory = (req, res) => {
  mysql
    .execute(`DELETE FROM  product_type where ProductTypeID=?`, [req.params.id])
    .then((rows, err) => {
      if (err) {
        res.send(err);
      } else {
        res.end("Product Deleted Successfully");
      }
      res.end();
    });
};
