const productController = require("../controllers/product.controller");
const express = require("express");
const router = express.Router();


router.post("/addProduct", productController.addProduct);
router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductById/:id", productController.getProductById);
router.put("/editProductById/:id", productController.editProductById);
router.delete("/deleteProductById/:id", productController.deleteProductbyId);

module.exports = router;
