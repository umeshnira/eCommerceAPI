const controller = require("../product.controller");

exports.subProductTypeCategoryModel = (req) =>{
    
    let value = req.body;

    let model = {
        productTypeId: value.productTypeId ? value.productTypeId:'',
        name : value.subProductTypeName? value.subProductTypeName: '',
        description : value.subProductTypeDescription? value.subProductTypeDescription : '',
        
    }

    return model;
} 