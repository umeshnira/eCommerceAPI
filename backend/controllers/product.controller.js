const productParser = require("../controllers/requestparser/product.parser");
const productRepository = require("../repository/product.repository");


//Api for product

exports.addProduct = async (req, res) => {

  try {

    const model = productParser.productModel(req);
    const newproduct = await productRepository.addProduct(model);
    res.status(200).send("Product added successfully");

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.getAllProducts = async (req, res) => {

  try {

    const allProducts = await productRepository.getAllProduct();
    res.status(200).send(JSON.stringify(rows[0]));

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.getProductById = async (req, res) => {

  try {

    const productById = await productRepository.getProductById(req);
    res.status(200).send(JSON.stringify(rows[0]));

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.editProductById = async (req, res) => {

  try {

    const model = productParser.productModel(req);
    const updatedProduct = await productRepository.editProductById(model, req);
    res.status(200).send("Updated product successfully");

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.deleteProductbyId = async (req, res) => {

  try {

    const deletedProduct = await productRepository.deleteProductById(req);
    res.status(200).send("Deleted product Successfully");

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};
