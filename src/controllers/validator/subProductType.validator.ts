exports.subProductTypeModelValidation = (model) => {

  const result = [];
  if (model.productTypeId === null || model.productTypeId === undefined || model.productTypeId === '') {
    result.push('productTypeId is missing');
  }
  if (model.subProductTypeName === null || model.subProductTypeName === undefined || model.subProductTypeName === '') {
    result.push('subProductTypeName is missing');
  }
  if (model.subProductTypeDescription === null || model.subProductTypeDescription === undefined || model.subProductTypeDescription === '') {
    result.push('subProductTypeDescription is missing');
  }

  return result;

}