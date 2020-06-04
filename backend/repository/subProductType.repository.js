const mysql = require("../database/database.config");

exports.addSubProductType = (model) => {

  return mysql.query(
    `INSERT INTO SUB_PRODUCT_TYPE (
            ProductTypeId,
            SubProductTypeName,
            SubProductTypeDescription
                )
         values (?,?,?)`,
    [
      model.productTypeId,
      model.subProductTypeName,
      model.subProductTypeDescription,
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