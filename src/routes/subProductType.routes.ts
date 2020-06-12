import * as express from 'express';
const subProductTypeController = require("../controllers/subProductType.controller");
const router = express.Router();

router.post("/addSubProductType", subProductTypeController.addSubProductType);
router.get("/getAllSubProdctTypes", subProductTypeController.getAllSubProductTypes);
router.get("/getSubProdctTypeById/:id", subProductTypeController.getSubProductTypeById);
router.put("/editSubProductTypeById/:id", subProductTypeController.editSubProductTypeById);
router.delete("/deleteSubProductTypeById/:id", subProductTypeController.deleteSubProductTypeById);
router.get("/getSubProductTypesAganistProductTypeId/:id", subProductTypeController.getSubProductTypesAganistProductTypeId);

module.exports = router;