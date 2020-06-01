const sellerRepository = require('../repository/seller.repository');
const clientRepository = require('../repository/client.repository');
const loginRepository = require('../repository/login.repository');
const parseSeller = require('./requestparser/seller.requestParser');
const parseClient = require('./requestparser/client.requestParser');


exports.addRegistrationDetails = async (req, res) => {

    let reqModel = req.body;

  try {
    if(reqModel.role === 'Seller'){
    const seller = parseSeller.parse(reqModel);
    const newSeller = await sellerRepository.addSeller(seller);
    exports.insertId = newSeller[0].insertId;
    const login = await loginRepository.addLoginDetails(seller);
    res.send("Registration completed Successfully");
    res.end();
    }
    
    if(reqModel.role === 'Client') {
        const client = parseClient.parse(reqModel);
        const newClient = await clientRepository.addClient(client);
        exports.insertId = newClient[0].insertId;
        const login = await loginRepository.addLoginDetails(client);
        res.send("Registration completed Successfully");
        res.end();
        }

  } catch (error) {
    console.log('Catch error', error);
    res.send(error);

  }
};

