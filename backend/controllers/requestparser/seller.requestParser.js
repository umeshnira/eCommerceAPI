exports.parse = (reqModel) => {

  let value = reqModel;

  let model = {
    sellerName: value.sellerName,
    address: value.address,
    landmark: value.landmark,
    pincode: value.pincode,
    email: value.email,
    isDeleted: value.isDeleted,
    phoneNo: value.phoneNo,
    aadharcard: value.aadharcard,
    pancard: value.pancard,
    bankActNo: value.bankActNo,
    ifscCode: value.ifscCode,
    password: value.password,
    role: value.role
  }

  return model;

}
