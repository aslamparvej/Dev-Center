const { text } = require('express');
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
    const { name, email, phone, message } = req.body;

    try {

        const mainOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            // text: `You have a new message from ${name}(${email}):\n\n${message}`,
            html: `<div class="mail-template-container" style="height: 100%; width: 100%; background: #EAF0F3; font-family: Arial; color: #5E5E5E; font-size: 16px;font-weight: 400;line-height: 26px;">
            <div class="mail-template" style="width: 40rem; margin: 0 auto; height: 100%; padding: 1rem;">
            <div class="client-logo-container" style="margin-bottom: 2rem;">
            <img src="./assets/enerv-global-logo.png" alt="enerv global logo" />
            </div>
            <div class="mail-content" style="background: #FFFFFF; padding: 2rem;">
                <div class="mail-content-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <img src="./assets/verified-icon.png" alt="verified icon" style="display: none" />
                    <p>Dear <span style="color: #000000;">${name} (${email})</span>,</p>
                </div>
                <div class="mail-content-body">
                    <p>${message}</p>
                </div>
                <div class="mail-content-footer" style="margin-top: 1rem;">
                    <p>Thanks</p>
                    <p style="color: #000000;">
                        Dev Center Administrator
                    </p>
                </div>
            </div>
            <div class="footer-container" style="margin-top: 1rem;">
                <p style="color: #595959; width: 85%;margin: 0 auto;text-align: center;">You have received this email because one user has been created for you in Dev Center Admin Portal For help contact <span style="color: #006838;">support@devcenter.in</span>.</p>
            </div>
        </div>
    </div>`
        }

        transporter.sendMail(mainOptions, (error, info) => {
            if (error) {
                // return res.status(500).send('There was an error processing your request. Please try again later.');
                return res.render('user/includes/alert', { title: "Message Send", message: "There was an error processing your request. Please try again later.", icon: "error", confirmButtonText: "Ok", redirectLocation: "/contact" });
            } else {
                // return res.send('Thank you for contacting us! We will get back to you shortly.');
                return res.render('user/includes/alert', { title: "Message Send", message: "Thank you for contacting us! We will get back to you shortly.", icon: "success", confirmButtonText: "Ok", redirectLocation: "/contact" });
            }
        });

    } catch (error) {
        res.json({ Message: error });
    }
}

module.exports = {
    getContact: getContact,
    postContact: postContact
}