exports.productModel = (value) => {

  let model = {
    subProductTypeId: value.subProductTypeId,
    productName: value.productName,
    productDescription: value.productDescription,
    isDeleted: value.isDeleted
  }

  return model;
}