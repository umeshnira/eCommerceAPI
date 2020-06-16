class ProductPArser {

  static productModel = (req) => {

    const value = req.body;

    const model = {
      subProductTypeId: value.subProductTypeId,
      productName: value.productName,
      productDescription: value.productDescription,
      isDeleted: value.isDeleted
    }

    return model;
  }
}

export default ProductPArser;