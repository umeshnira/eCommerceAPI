var mysql = require("../database/database");
exports.getProducts = (req, res) => {
  mysql
    .execute(
      `SELECT p.*,sb.*,pt.* FROM ecommerce.product p
  left join sub_product_type sb ON sb.SubProductTypeId=p.SubProductTypeId
  left join product_type pt ON pt.ProductTypeId=sb.ProductTypeId`
    )
    .then((rows, err) => {
      if (err) {
        res.send(err);
      } else {
        res.end(JSON.stringify(rows[0]));
      }
      res.end();
    });
};
exports.getProductsById = (req, res) => {
  mysql
    .execute(
      `SELECT p.*,sb.*,pt.* FROM ecommerce.product p
  left join sub_product_type sb ON sb.SubProductTypeId=p.SubProductTypeId
  left join product_type pt ON pt.ProductTypeId=sb.ProductTypeId where p.ProductId=?`,
      [req.params.id]
    )
    .then((rows, err) => {
      if (err) {
        res.send(err);
      } else {
        res.end(JSON.stringify(rows[0]));
      }
      res.end();
    });
};
exports.deleteProductById = (req, res) => {
  mysql
    .execute(`DELETE FROM  ecommerce.product where ProductId=?`, [
      req.params.id,
    ])
    .then((rows, err) => {
      if (err) {
        res.send(err);
      } else {
        res.end("Product Deleted Successfully");
      }
      res.end();
    });
};
