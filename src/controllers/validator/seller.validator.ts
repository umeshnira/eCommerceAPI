exports.sellerModelValidation = (model) => {

  const result = [];
  if (model.sellerName === null || model.sellerName === undefined || model.sellerName === '') {
    result.push('sellerName is missing');
  }
  if (model.password === null || model.password === undefined || model.password === '') {
    result.push('password is missing');
  }
  if (model.email === null || model.email === undefined || model.email === '') {
    result.push('email is missing');
  }

  return result;

}