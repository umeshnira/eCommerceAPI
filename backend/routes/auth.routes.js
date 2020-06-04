var controller = require('../controllers/auth.controller');
const express = require('express');
const router = express.Router();

router.post("/signUp", controller.addRegistrationDetails);

module.exports = router;