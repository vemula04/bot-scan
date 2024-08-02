var express = require('express');
var router = express.Router();
require("../config/db");
// const tenantModel = require("../model/tenant");
const User = require('../models/user');

/* GET home page. */
router.get('/', async (req, res, next) => {
  // const newUser = new User({
  //   name: 'John Doe',
  //   email: 'johndoe_2@example.com',
  //   password: 'password123'
  // });
  // await newUser.save()
  // .then(() => console.log('User created'))
  // .catch((err) => console.log(err));

  await User.find()
  .then((users) => console.log(users))
  .catch((err) => console.log(err));

  // const tenants = await tenantModel.find({'name':'Ctrls'});  

  // console.log(`tenants details :: `, tenants)
  // // res.send(tenants)
  return res.status(200).json({
    message: "Hello from root!",
  });
  // res.render('index', tenants);
});

module.exports = router;
