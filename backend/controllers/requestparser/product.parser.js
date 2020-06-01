exports.productModel = (req) => {
  
    let value = req.body;

    let model = {

        subProductTypeId : value.subProductTypeId,
        productName : value.productName,
        productDescription : value.productDescription

    }

    return model;
}