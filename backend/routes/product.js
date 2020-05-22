var controller = require("../controllers/product");
const express = require("express");
const router = express.Router();
router.get("", controller.getProducts);
router.get("/productById/:id", controller.getProductsById);
router.delete("/deleteProduct/:id", controller.deleteProductById);
module.exports = router;
