const productTypeParser = require("../controllers/requestparser/productType.parser");
const productTypeRepository = require("../repository/productType.repository");


// Apis of product_type

exports.getAllProductCategories = async (req, res) => {

    try {
    
      const productCategories =  await productTypeRepository.getAllProductCategories(res);
    
    } catch (error) {
      console.log(error);
      res.send(error);
    }
      
    };
    
    exports.getProductCategoryById = async (req, res) => {

      try {

        const productCategoryById = await productTypeRepository.getProductCategoryById(req, res);

      } catch (error) {
        console.log(error);
        res.send(error);
      }
    };
    
    exports.deleteProductCategory = async (req, res) => {
      try {

        const deletedProductCategory = await productTypeRepository.deleteProductCategoryById(req, res);

      } catch (error) {
        console.log(error);
        res.send(error);
      }
    };
    
    exports.addProductCategory = async (req,res) => {
    
    try {
    
      const model = productTypeParser.productTypeModel(req);
      const newproductCategory = await productTypeRepository.addProductCategory(model);
      res.send("Product type added successfully");
     
    } catch (error) {
      console.log(error);
      res.send(error);
    }
    };
    
    exports.editProductCategoryById = async (req, res) => {
    
      try {
    
        const model = productTypeParser.productTypeModel(req);
        const updatedProductTypeCategory = await productTypeRepository.editProductCategoryById(model,req);
        res.send("Product type updated successfully");
       
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    };
    