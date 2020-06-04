const productParser = require("../controllers/requestparser/product.parser");
const productRepository = require("../repository/product.repository");
const productValidator = require('../controllers/validator/product.validator');



//Api for product

exports.addProduct = async (req, res) => {

  try {

    var reqModel = req.body;
    const model = await productParser.productModel(reqModel);

    const validationResult = await productValidator.productModelValidation(model);
    if (validationResult.length > 0) {
      res.status(400).send(validationResult);
    } else {
      const newProduct = await productRepository.addProduct(model);
      res.status(200).send("Product added successfully");
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }

};

exports.getAllProducts = async (req, res) => {

  try {

    const allProducts = await productRepository.getAllProducts();
    if (allProducts[0].length > 0) {
      res.status(200).json(allProducts[0]);
    } else {
      res.status(404).send('Data Not Found');
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }

};

exports.getProductById = async (req, res) => {

  try {

    const productById = await productRepository.getProductById(req);
    if (productById[0].length > 0) {
      res.status(200).json(productById[0]);
    } else {
      res.status(404).send('Data Not found')
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }

};

exports.editProductById = async (req, res) => {

  try {

    const model = await productParser.productModel(req);

    const validationResult = await productValidator.productModelValidation(model);
    if (validationResult.length > 0) {
      res.status(400).send(validationResult);
    } else {
      const updatedProduct = await productRepository.editProductById(model, req);
      res.status(200).send("Updated product successfully");
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }

};

exports.deleteProductById = async (req, res) => {

  try {

    const deletedProduct = await productRepository.deleteProductById(req);
    res.status(200).send("Deleted product Successfully");

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }

};
