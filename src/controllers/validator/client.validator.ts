exports.clientModelValidation = (model) => {

  const result = [];
  if (model.userName === null || model.userName === undefined || model.userName === '') {
    result.push('userName is missing');
  }
  if (model.password === null || model.password === undefined || model.password === '') {
    result.push('password is missing');
  }

  return result;

}