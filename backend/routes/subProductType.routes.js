const subProductTypeController = require("../controllers/subProductType.controller");
const express = require("express");
const router = express.Router();

router.post("/addSubProductTypeCategory",subProductTypeController.addSubProductTypeCategory);
router.get("/getAllSubProdctTypeCategories", subProductTypeController.getAllSubProductTyepCategories);
router.get("/getSubProdctTypeCategoryById/:id", subProductTypeController.getSubProductTyepCategoryById);
router.put("/editSubProductTypeCategoryById/:id", subProductTypeController.editSubProductTypeCategoryById);
router.delete("/deleteSubProductTypeCategoryById/:id", subProductTypeController.deleteSubProductTypeCategoryById);

module.exports = router;