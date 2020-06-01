const subProductTypeParser = require("../controllers/requestparser/subProductTypeCategory.parser");
const subProductTypeCategoryRepository = require("../repository/subProductTypeCategory.repository");



//Apis of Sub product type

exports.addSubProductTypeCategory = async (req, res) => {

    try {
  
      const model = await subProductTypeParser.subProductTypeCategoryModel(req);
      const newSubProductTypeCategory = await subProductTypeCategoryRepository.addSubProductTypeCategory(model);
      res.send("Sub product category added successfully");
      res.end();
  
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  
  exports.getAllSubProductTyepCategories = async (req, res) => {
  
    try {
  
      const subProductTypeCategories = await subProductTypeCategoryRepository.getAllSubProductTyepCategories(res);
     
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  
  exports.getSubProductTyepCategoryById = async (req, res) => {
  
    try {
  
      const subProductTypeCategory = await subProductTypeCategoryRepository.getSubProductTyepCategoryById(req,res);
     
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  
  exports.editSubProductTypeCategoryById = async (req, res) => {
  
    try {
  
      const model = await subProductTypeParser.subProductTypeCategoryModel(req);
      const updatedSubProductTypeCategory = await subProductTypeCategoryRepository.editSubProductTyepCategoryById(model,req);
      res.send("Sub product category updated successfully");
     
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  
  exports.deleteSubProductTypeCategoryById = async (req, res) => {
  
    try {
  
      const deletedSubProductTypeCategory = await subProductTypeCategoryRepository.deleteSubProductTypeCategoryById(req);
      res.send("Deleted Sub product category of id  " +req.params.id + " successfully");
     
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };