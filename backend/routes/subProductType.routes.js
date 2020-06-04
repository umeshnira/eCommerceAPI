const subProductTypeController = require("../controllers/subProductType.controller");
const express = require("express");
const router = express.Router();

router.post("/addSubProductType", subProductTypeController.addSubProductType);
router.get("/getAllSubProdctTypes", subProductTypeController.getAllSubProductTypes);
router.get("/getSubProdctTypeById/:id", subProductTypeController.getSubProductTypeById);
router.put("/editSubProductTypeById/:id", subProductTypeController.editSubProductTypeById);
router.delete("/deleteSubProductTypeById/:id", subProductTypeController.deleteSubProductTypeById);

module.exports = router;