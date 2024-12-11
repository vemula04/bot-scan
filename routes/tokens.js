var express = require('express');
var router = express.Router();
const db = require("../config/db");
const auth = require('../middleware/auth');
const Token = require("../models/token");
const Tenant = require('../models/tenant');
const Role = require('../models/roles');

router.get('/getTokenByTenant', async (req, res) => {
    try {
        console.log(req);
        const { t_id } = (req.query);
        const token = await Token.findOne({
            tenant_id: t_id
        });
        if (!token) return res.status(400).send("Invalid credentails");
        res.send(token);
    } catch (err) {
        throw err;
    }


});

module.exports = router;

