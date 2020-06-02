const mysql = require("../database/database.config");


exports.addSubProductTypeCategory = (model) => {

  return mysql.query(
    `INSERT INTO SUB_PRODUCT_TYPE (
            ProductTypeId,
            SubProductTypeName,
            SubProductTypeDescription
                )
         values (?,?,?)`,
    [
      model.productTypeId,
      model.name,
      model.description,
    ]
  )

};

exports.getAllSubProductTyepCategories = () => {

  return mysql.execute(
    `SELECT * FROM sub_product_type `
  )

}

exports.getSubProductTyepCategoryById = (req) => {

  return mysql.execute(
    `SELECT * FROM sub_product_type where SubProductTypeId=?`,
    [
      req.params.id,
    ])

};

exports.editSubProductTyepCategoryById = (model, req) => {

  return mysql.execute(
    `UPDATE sub_product_type set 
      SubProductTypeName =? , 
      SubProductTypeDescription =? 
      WHERE SubProductTypeId = ?`,
    [
      model.name,
      model.description,
      req.params.id
    ]
  )

};

exports.deleteSubProductTypeCategoryById = (req) => {

  return mysql.execute(
    `DELETE FROM  sub_product_type where SubProductTypeId=?`,
    [
      req.params.id
    ]
  )

};