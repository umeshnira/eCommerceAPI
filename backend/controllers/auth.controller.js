const sellerRepository = require('../repository/seller.repository');
const clientRepository = require('../repository/client.repository');
const loginRepository = require('../repository/login.repository');
const parseSeller = require('./requestparser/seller.requestParser');
const parseClient = require('./requestparser/client.requestParser');
const sellerValidator = require('../controllers/validator/seller.validator');
const clientValidator = require('../controllers/validator/client.validator');


exports.addRegistrationDetails = async (req, res) => {

  let reqModel = req.body;
  try {

    if (reqModel.role === 'Seller') {

      const seller = parseSeller.parse(reqModel);
      const validationResult = await sellerValidator.sellerModelValidation(seller);
      if (validationResult.length > 0) {
        res.status(400).send(validationResult);
      } else {
        addSeller(seller, res);
      }

    } else if (reqModel.role === 'Client') {

      const client = parseClient.parse(reqModel);
      const validationResult = await clientValidator.clientModelValidation(client);
      if (validationResult.length > 0) {
        res.status(400).send(validationResult);
      } else {
        addClient(client, res);
      }

    } else {
      res.status(400).send('The user with the given role does not exists');
    }

  } catch (error) {
    console.log('Catch error', error);
    res.status(500).send(error.message);

  }
};


addSeller = async (sellerModel, res) => {

  try {

    const newSeller = await sellerRepository.addSeller(sellerModel);
    const insertId = newSeller[0].insertId;
    const login = await loginRepository.addLoginDetails(sellerModel, insertId);
    res.status(200).json({"message": "Registration completed Successfully"});
    res.send(body);
  } catch (error) {
    res.status(400).send(error.message);
  }

}

addClient = async (clientModel, res) => {

  try {

    const newClient = await clientRepository.addClient(clientModel);
    const insertId = newClient[0].insertId;
    const login = await loginRepository.addLoginDetails(clientModel, insertId);
    res.status(200).json({"message": "Registration completed Successfully"});
    res.send(body);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }

}