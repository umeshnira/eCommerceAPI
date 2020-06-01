
const productParser = require("../controllers/requestparser/product.parser");
const productRepository = require("../repository/product.repository");


//Api for product

exports.addProduct = async (req,res) => {

  try {

    const model =  productParser.productModel(req);
    const newproduct = await productRepository.addProduct(model);
    res.send("Product added successfully");
    res.end();

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.getAllProducts = async (req, res) => {

  try {

    const allProducts = await productRepository.getAllProduct(res);

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.getProductById = async (req, res) => {

  try {

    const productById = await productRepository.getProductById(req, res);

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.editProductById = async (req, res) => {

  try {

    const model = productParser.productModel(req);
    const updatedProduct = await productRepository.editProductById(model, req);
    res.send("Updated product successfully");

  } catch (error) {
    console.log(error);
    res.send(error);
  }

};

exports.deleteProductbyId = async (req, res) => {

  try {

    const deletedProduct = await productRepository.deleteProductById(req);
    res.send("Deleted product Successfully");

  } catch(error) {
    console.log(error);
    res.send(error);
  }

};

