const mysql = require("../database/database.config");


exports.addSeller = (model) => {


  return mysql.query(
    `INSERT INTO SELLER (
            SellerName,
            Address, 
            LandMark, 
            Pincode, 
            Email, 
            IsDeleted, 
            PhoneNo, 
            AadharCard, 
            PanCard, 
            BankAcNo, 
            ISFCCode,
            Password
            )
     values (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      model.sellerName,
      model.address,
      model.landmark,
      model.pincode,
      model.email,
      model.isDeleted,
      model.phoneNo,
      model.aadharcard,
      model.pancard,
      model.bankActNo,
      model.ifscCode,
      model.password
    ]

  )


};