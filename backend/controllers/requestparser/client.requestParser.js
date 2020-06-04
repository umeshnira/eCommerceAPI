exports.parse = (reqModel) => {

  let model = {
    userName: reqModel.userName,
    password: reqModel.password,
    role: reqModel.role,
    isDeleted: reqModel.isDeleted,
  }

  return model;

}