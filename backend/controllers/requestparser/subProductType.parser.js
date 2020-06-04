exports.subProductTypeModel = (req) => {

  let value = req.body;

  let model = {
    productTypeId: value.productTypeId,
    subProductTypeName: value.subProductTypeName,
    subProductTypeDescription: value.subProductTypeDescription
  }

  return model;
}