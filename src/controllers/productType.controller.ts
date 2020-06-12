const productTypeParser = require("../controllers/requestparser/productType.parser");
const productTypeRepository = require("../repository/productType.repository");
const productTypeValidator = require('../controllers/validator/productType.validator');


// Apis of product_type

exports.getAllProductTypes = async (req, res) => {

  try {

    res.send('Successful');
    // const productTypes = await productTypeRepository.getAllProductTypes();

    // if (productTypes[0].length > 0) {
    //   res.status(200).json(productTypes[0]);
    // } else {
    //   res.status(404).send('Data Not Found');
    // }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }

};

exports.getProductTypeById = async (req, res) => {

  try {

    res.send('Successful');
    // const productTypeById = await productTypeRepository.getProductTypeById(req);

    // if (productTypeById[0].length > 0) {
    //   res.status(200).json(productTypeById[0]);
    // } else {
    //   res.status(404).send('Data Not Found');
    // }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.deleteProductType = async (req, res) => {
  try {

    res.send('Successful');
    // const deletedProductType = await productTypeRepository.deleteProductTypeById(req);
    // res.status(200).send('Deleted Product Category successfully');

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.addProductType = async (req, res) => {

  try {

    res.send('Successful');
    // const model = await productTypeParser.productTypeModel(req);

    // const validationResult = await productTypeValidator.productTypeModelValidation(model);
    // if (validationResult.length > 0) {
    //   res.status(400).send(validationResult);
    // } else {
    //   const newProductType = await productTypeRepository.addProductType(model);
    //   res.status(200).send("Product type added successfully");
    // }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.editProductTypeById = async (req, res) => {

  try {

    res.send('Successful');
    // const model = await productTypeParser.productTypeModel(req);

    // const validationResult = await productTypeValidator.productTypeModelValidation(model);
    // if (validationResult.length > 0) {
    //   res.status(400).send(validationResult);
    // } else {
    //   const updatedProductType = await productTypeRepository.editProductTypeById(model, req);
    //   res.status(200).send("Product type updated successfully");
    // }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};