const mysql = require("../database/database.config");
var myDate = new Date();

exports.addSeller = (model) => {

  return mysql.query(
    `INSERT INTO SELLER (
            SellerName,
            Address, 
            LandMark, 
            Pincode, 
            Email, 
            PhoneNo, 
            AadharCard, 
            PanCard, 
            BankAcNo, 
            ISFCCode,
            Password,
            CreatedDate
            )
     values (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      model.sellerName,
      model.address,
      model.landmark,
      model.pincode,
      model.email,
      model.phoneNo,
      model.aadharcard,
      model.pancard,
      model.bankActNo,
      model.ifscCode,
      model.password,
      myDate
    ]
  )
};