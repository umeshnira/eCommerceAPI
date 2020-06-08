const mysql = require("../database/database.config");
var date = new Date();

exports.addSubProductType = (model) => {

  return mysql.query(
    `INSERT INTO SUB_PRODUCT_TYPE (
            ProductTypeId,
            SubProductTypeName,
            SubProductTypeDescription,
            CreatedDate
                )
         values (?,?,?,?)`,
    [
      model.productTypeId,
      model.subProductTypeName,
      model.subProductTypeDescription,
      date
    ]
  )
};

exports.getAllSubProductTypes = () => {

  return mysql.execute(
    `SELECT * FROM sub_product_type `
  )
};

exports.getSubProductTypeById = (req) => {

  return mysql.execute(
    `SELECT * FROM sub_product_type where SubProductTypeId=?`,
    [
      req.params.id,
    ]
  )
};

exports.editSubProductTypeById = (model, req) => {

  return mysql.execute(
    `UPDATE sub_product_type set 
      ProductTypeId =?,
      SubProductTypeName =? , 
      SubProductTypeDescription =? 
      WHERE SubProductTypeId = ?`,
    [
      model.productTypeId,
      model.subProductTypeName,
      model.subProductTypeDescription,
      req.params.id
    ]
  )
};

exports.deleteSubProductTypeById = (req) => {

  return mysql.execute(
    `DELETE FROM  sub_product_type where SubProductTypeId=?`,
    [
      req.params.id
    ]
  )
};

exports.getSubProductTypesAganistProductTypeId = (req) => {

  const getSubProductTypeQuery =
    `select sub_product_type.subProductTypeId, 
     sub_product_type.subProductTypeName, 
     product_type.productTypeId, 
     product_type.productTypeName 
     from 
     sub_product_type 
     INNER JOIN 
     product_type
     ON 
     sub_product_type.ProductTypeId = product_type.ProductTypeId
     WHERE 
     sub_product_type.ProductTypeId = ?`;
  return mysql.query(getSubProductTypeQuery, [req.params.id]);
}