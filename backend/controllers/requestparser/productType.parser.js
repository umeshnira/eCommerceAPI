exports.productTypeModel = (req) => {

    let value = req.body;

    let model = {
        name : value.productTypeName,
        description : value.productTypeDescription
    }

    return model;
}