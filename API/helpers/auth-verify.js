const keys = require('../../config/keys');

const Register = require('../models/register');

module.exports = [

    tokenVerify = (req, res, next) => {
        if (!req.headers.authorization)
            return res.status(401).send('Unauthorized request!!');
        try {
            const decode = jwt.verify(req.body.token, keys.JWT_key);
            req.user_token = decode;
            next();
        } catch (err) {
            return res.status(401).json({
                message: 'Not Autherized!! kindly login!!'
            });
        }
    },

    admin_verification = (req, res, next) => {
        if (!req.headers.authorization)
            return res.status(401).send('Unauthorized request');
        try {
            const decode = jwt.verify(req.body.token, keys.JWT_key);
            req.user_token = decode;
            // admin verification using a if else statement!
            next();
        } catch (err) {
            return res.status(401).json({
                message: 'Not Autherized!! kindly login!!'
            });
        }
    }

];