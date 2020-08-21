const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
function email(emailreceiver, subject, text, html) {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "led4agriculture@gmail.com",
        pass: "Led@4Agriculture.1038",
      },
    })
  );

  let mailDetails = {
    from: "led4agriculture@gmail.com",
    to: emailreceiver,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("an error occurred", err);
      throw new Error();
    } else {
      console.log("Email sent successfully");
    }
  });
}
module.exports.email = email;
