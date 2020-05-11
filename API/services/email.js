const sgMail = require('@sendgrid/mail');
const keys = require('../../config/keys');

sgMail.setApiKey(process.env.SENDGRID_API_KEY || keys.SendGrid_API_key);

exports.send_confirmation_email_after_booking = (req, res) => {

    const msg = {
        to: req.body.email,
        from: 'admin@usip.com',
        cc: 'hello@usip.com',
        subject: `SUBJECT OF THE EMAIL TO BE SENT`,
        text: 'some text for the email',
        html: body,
    };

    sgMail.send(msg).then(doc => {
        return res.status(200).json({
            message: 'Congratulation!'
        })
    }).catch(err => {
        return res.status(200).json({
            message: 'congratulations! with error!'
        })
    });
}