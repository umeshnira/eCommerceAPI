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

exports.getSubProductTypesAganistProductTypeId = async (req, res) => {
  try {
    
    const list = await subProductTypeRepository.getSubProductTypesAganistProductTypeId(req);
    if(list[0].length > 0){
    res.status(200).json(list[0]);
    }
  } catch (error) {
    console.log(error);
  }
} 
 
createModel = (result) => {
resultItem = [];
items=[];
  for (item in result){
    
    var productType = {
      id: result[item].productTypeId,
      name: result[item].productTypeName,
      subProductType : {
        id: result[item].subProductTypeId,
        name: result[item].subproductTypeName
      } 
    }
    resultItem.push(productType);
  }

    
console.log('item',resultItem);
}


// createModel = async (results) => {
//   try{
//     var source = [];
//     var items = [];
//   for (i = 0; i < results.length; i++) {
//     var item = results[i];
//     var label = item["productTypeName"];
//     console.log('ll',label);
//     var parentid = item["productTypeId"];
//     var id = item["subproductTypeId"];

//     if (items[parentid]) {
//       var item = { parentid: parentid, label: label, item: item };

//       if (!items[parentid].items) {
//           items[parentid].items = [];
//       }

//       items[parentid].items[items[parentid].items.length] = item;
//       items[id] = item;

//   }
//   else {
//       items[id] = { parentid: parentid, label: label, item: item };
//       source[id] = items[id];
//  }
// }
// return items
//   }
//   catch(error) 
//   {
//     console.log(error);
//   }
// }