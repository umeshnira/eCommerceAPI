exports.productTypeModel = (req) => {

  let value = req.body;

  let model = {
    productTypeName: value.productTypeName,
    productTypeDescription: value.productTypeDescription
  }

  return model;
}