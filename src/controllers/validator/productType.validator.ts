exports.productTypeModelValidation = (model) => {

  const result = [];
  if (model.productTypeName === null || model.productTypeName === undefined || model.productTypeName === '') {
    result.push('productTypeName is missing');
  }
  if (model.productTypeDescription === null || model.productTypeDescription === undefined || model.productTypeDescription === '') {
    result.push('productTypeDescription is missing');
  }

  return result;

}