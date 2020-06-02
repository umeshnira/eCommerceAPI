const productTypeParser = require("../controllers/requestparser/productType.parser");
const productTypeRepository = require("../repository/productType.repository");


// Apis of product_type

exports.getAllProductCategories = async (req, res) => {

  try {

    const productCategories = await productTypeRepository.getAllProductCategories();
    res.status(200).send(JSON.stringify(rows[0]));

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.getProductCategoryById = async (req, res) => {

  try {

    const productCategoryById = await productTypeRepository.getProductCategoryById(req);
    res.status(200).send(JSON.stringify(rows[0]));

  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.deleteProductCategory = async (req, res) => {
  try {

    const deletedProductCategory = await productTypeRepository.deleteProductCategoryById(req);
    res.status(200).send('Deleted Product Category successfully');

  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.addProductCategory = async (req, res) => {

  try {

    const model = productTypeParser.productTypeModel(req);
    const newproductCategory = await productTypeRepository.addProductCategory(model);
    res.status(200).send("Product type added successfully");

  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.editProductCategoryById = async (req, res) => {

  try {

    const model = productTypeParser.productTypeModel(req);
    const updatedProductTypeCategory = await productTypeRepository.editProductCategoryById(model, req);
    res.status(200).send("Product type updated successfully");

  } catch (error) {
    console.log(error);
    res.send(error);
  }
};