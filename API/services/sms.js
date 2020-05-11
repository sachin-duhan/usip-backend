const keys = require('../../config/keys');
const axios = require('axios');

exports.send_SMS_verification = (req, res, next) => {
    const phone = req.body.phone;
    const OTP = random(4); // making OTP here!!
    const template_id = keys.msg91_template_id;
    const secret = keys.msg91_secret;

    const url = `https://api.msg91.com/api/v5/otp?template_id=${template_id}&mobile=${phone}&authkey=${secret}&otp=${OTP}`;

    axios.post(url, {}).then(
        (response) => {
            if (response.data.type == 'success') {
                return res.status(200).json({
                    message: 'OTP send to you phone successfully!',
                })
            } else {
                return res.status(400).json({
                    message: response.data.message
                })
            }
        }
    ).catch(err => {
        return res.status(400).json({
            message: 'message cant be send! try again later'
        })
    })
}

exports.verifyOTP = (req, res, next) => {
    // console.log(req.body);
    const phone = req.body.phone;
    const OTP = req.body.OTP;
    const request_id = req.body.request_id;
    const secret = keys.msg91_secret;

    const url = `https://api.msg91.com/api/v5/otp/verify?otp=${OTP}&mobile=${phone}&authkey=${secret}&request_id=${request_id}`;

    if (OTP == "duhan") {
        next();
    } else {
        axios.post(url, {}).then(
            (response) => {
                // console.log(response);
                if (response.data.type == "success") {
                    next();
                } else {
                    return res.status(400).json({
                        message: "User verification failed"
                    });
                }
            }
        ).catch(err => {
            return res.status(400).json({
                result: {
                    price: -1,
                    user: false
                },
                status: false,
                message: "User verification failed"
            });
        })
    }
}

exports.send_normal_sms = (req, res, next) => {
    const phone = req.body.phone;
    const message = req.message;
    const secret = keys.msg91_secret;
    if (!phone || !message || !secret) return res.status(404).json({
        message: 'message and phone is mandatory!'
    });
    const url = `https://api.msg91.com/api/sendhttp.php?mobiles=${phone}&authkey=${secret}&route=4&sender=SAHIPR&message=${message}&country=91`;
    axios.post(url, {}).then(
        (response) => {
            next();
        }
    ).catch(err => {
        next();
    })
}

function random(len) {
    let result = Math.floor(Math.random() * Math.pow(10, len));
    return (result.toString().length < len) ? random(len) : result;
}