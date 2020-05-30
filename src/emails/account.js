const sgMail = require("@sendgrid/mail");

const sendGridAPIKey = "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";

sgMail.setApiKey(sendGridAPIKey);

sgMail.send({
    to:"pawan.mca16.du@gmail.com",
    from : "pawanbisht83@gmail.com",
    subject : "This is my first node mailer",
    text : 'Hello pawan bisht wellcome to send/grid.com'
            
},(err,info)=>{ 
    if(err)
        return console.log("Error is ",err.response.body.errors);
    console.log(info);    
})