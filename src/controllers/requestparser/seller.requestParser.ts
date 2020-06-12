exports.parse = (reqModel) => {

  let model = {
    sellerName: reqModel.sellerName,
    address: reqModel.address,
    landmark: reqModel.landmark,
    pincode: reqModel.pincode,
    email: reqModel.email,
    phoneNo: reqModel.phoneNo,
    aadharcard: reqModel.aadharcard,
    pancard: reqModel.pancard,
    bankActNo: reqModel.bankActNo,
    ifscCode: reqModel.ifscCode,
    password: reqModel.password,
    role: reqModel.role
  }

  return model;

}
