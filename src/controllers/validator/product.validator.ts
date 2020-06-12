exports.productModelValidation = (model) => {

  const result = [];
  if (model.subProductTypeId === null || model.subProductTypeId === undefined || model.subProductTypeId === '') {
    result.push('subProductTypeId is missing');
  }
  if (model.productName === null || model.productName === undefined || model.productName === '') {
    result.push('productName is missing');
  }
  if (model.productDescription === null || model.productDescription === undefined || model.productDescription === '') {
    result.push('productDescription is missing');
  }

  return result

}