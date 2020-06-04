const productTypeController = require("../controllers/productType.controller");
const express = require("express");
const router = express.Router();

router.get("/getAllProductTypes", productTypeController.getAllProductTypes);
router.get("/getProductTypeById/:id", productTypeController.getProductTypeById);
router.delete("/deleteProductType/:id", productTypeController.deleteProductType);
router.post("/addProductType", productTypeController.addProductType);
router.put("/editProductTypeById/:id", productTypeController.editProductTypeById);

module.exports = router;
