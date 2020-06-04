const subProductTypeParser = require("../controllers/requestparser/subProductType.parser");
const subProductTypeRepository = require("../repository/subProductType.repository");
const subProductTypeValidator = require('../controllers/validator/subProductType.validator');



//Apis of Sub product type

exports.addSubProductType = async (req, res) => {

  try {

    const model = await subProductTypeParser.subProductTypeModel(req);

    const validationResult = await subProductTypeValidator.subProductTypeModelValidation(model);
    if (validationResult.length > 0) {
      res.status(400).send(validationResult);
    } else {
      const newSubProductType = await subProductTypeRepository.addSubProductType(model);
      res.status(200).send("Sub product type added successfully");
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.getAllSubProductTypes = async (req, res) => {

  try {

    const subProductTypes = await subProductTypeRepository.getAllSubProductTypes();

    if (subProductTypes[0].length > 0) {
      res.status(200).json(subProductTypes[0]);
    } else {
      res.status(404).send('Data Not Found');
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.getSubProductTypeById = async (req, res) => {

  try {

    const subProductType = await subProductTypeRepository.getSubProductTypeById(req);

    if (subProductType[0].length > 0) {
      res.status(200).json(subProductType[0]);
    } else {
      res.status(404).send('Data Not Found');
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.editSubProductTypeById = async (req, res) => {

  try {

    const model = await subProductTypeParser.subProductTypeModel(req);

    const validationResult = await subProductTypeValidator.subProductTypeModelValidation(model);
    if (validationResult.length > 0) {
      res.status(400).send(validationResult);
    } else {
      const updatedSubProductType = await subProductTypeRepository.editSubProductTypeById(model, req);
      res.status(200).send("Sub product type updated successfully");
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.deleteSubProductTypeById = async (req, res) => {

  try {

    const deletedSubProductType = await subProductTypeRepository.deleteSubProductTypeById(req);
    res.status(200).send("Deleted Sub product type of id  " + req.params.id + " successfully");

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};