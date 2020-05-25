var controller = require("../controllers/product");
const express = require("express");
const router = express.Router();
router.get("", controller.getProductCategory);
router.get("/productById/:id", controller.getProductCategoryById);
router.delete("/deleteProduct/:id", controller.deleteProductCategory);
module.exports = router;
