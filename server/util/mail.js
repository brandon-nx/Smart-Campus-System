const nodemailer = require("nodemailer");

let transporter;

async function createTransporter() {
  let testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log("Test account: ", testAccount);
}

async function sendMail(to, subject, text, html = null) {
  if (!transporter) {
    await createTransporter();
  }

  const info = await transporter.sendMail({
    from: '"URoute" no-reply@soton.ac.uk>',
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return info;
}

module.exports = { sendMail };
