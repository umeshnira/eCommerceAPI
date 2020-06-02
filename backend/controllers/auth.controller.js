const sellerRepository = require('../repository/seller.repository');
const clientRepository = require('../repository/client.repository');
const loginRepository = require('../repository/login.repository');
const parseSeller = require('./requestparser/seller.requestParser');
const parseClient = require('./requestparser/client.requestParser');


exports.addRegistrationDetails = async (req, res) => {

  let reqModel = req.body;

  try {

    if (reqModel.role === undefined || reqModel.role === '' || reqModel.role === null) {

      res.status(400).send('Role of the user is missing');

    } else if (reqModel.role === 'Seller') {

      const seller = parseSeller.parse(reqModel);
      const newSeller = await sellerRepository.addSeller(seller);
      const insertId = newSeller[0].insertId;
      const login = await loginRepository.addLoginDetails(seller, insertId);
      res.status(200).send("Registration completed Successfully");

    } else if (reqModel.role === 'Client') {

      const client = parseClient.parse(reqModel);
      const newClient = await clientRepository.addClient(client);
      const insertId = newClient[0].insertId;
      const login = await loginRepository.addLoginDetails(client, insertId);
      res.status(200).send("Registration completed Successfully");

    } else {
      res.status(400).send('The user with the given role does not exists');
    }

  } catch (error) {
    console.log('Catch error', error);
    res.status(500).send(error.message);

  }
};
