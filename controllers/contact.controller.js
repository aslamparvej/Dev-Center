const nodemailer = require('nodemailer');
require('dotenv').config();

function getContact(req, res) {
    res.render('user/contact/contact');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});



function postContact(req, res) {
    const {name, email, phone, message} = req.body;

    try {

        const mainOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            text: `You have a new message from ${name}(${email}):\n\n${message}`,
        }

        transporter.sendMail(mainOptions, (error, info)=>{
            if (error) {
                return res.status(500).send('There was an error processing your request. Please try again later.');
            } else {
                // return res.send('Thank you for contacting us! We will get back to you shortly.');
                return res.render('user/includes/alert', {title:"Message Send", message: "Thank you for contacting us! We will get back to you shortly.", icon: "success", confirmButtonText: "Ok", redirectLocation: "/contact" });
            }
        });

    } catch (error) {
        res.json({Message: error});
    }
}

module.exports = {
    getContact: getContact,
    postContact: postContact
  }