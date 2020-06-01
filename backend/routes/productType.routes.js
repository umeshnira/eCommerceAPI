const productTypeController = require("../controllers/productType.controller");
const express = require("express");
const router = express.Router();

router.get("getAllProductCategories", productTypeController.getAllProductCategories);
router.get("/getProductCategoryById/:id", productTypeController.getProductCategoryById);
router.delete("/deleteProductCategory/:id", productTypeController.deleteProductCategory);
router.post("/addProductCategory", productTypeController.addProductCategory);
router.put("/editProductCategoryById/:id", productTypeController.editProductCategoryById);

module.exports = router;
