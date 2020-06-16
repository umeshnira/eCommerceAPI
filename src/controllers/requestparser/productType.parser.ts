
class Modelparser {

  static productTypeModel = (req) => {

    const value = req.body;

    const model = {
      name: value.name,
      description: value.description,
      createdBy: value.createdBy
    }

    return model;
  }
}

export default Modelparser;