
class ClientParser {

  static parse = (req) => {

    const value = req.body;

    const model = {
      userName: value.userName,
      password: value.password,
      role: value.role
    }

    return model;

  }
}
export default ClientParser;