const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.send({
    to: "pawan.mca16.du@gmail.com",
    from: "pawanbisht83@gmail.com",
    subject: "This is my first node mailer",
    text: 'Hello pawan bisht wellcome to send/grid.com'

}, (err, info) => {
    if (err)
        return console.log("Error is ", err.response.body.errors);
    console.log(info);
})