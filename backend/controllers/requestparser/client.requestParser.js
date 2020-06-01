exports.parse = (reqMoodel) => {

    let value = reqMoodel;
    console.log('client',value);
  
    let model = {
      userName: value.userName,
      password: value.password,
      role: value.role,
      isDeleted: value.isDeleted,
    }
  
    return model;
  
  }
  