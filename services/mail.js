const nodemailer = require("nodemailer");
const commonOptions = require("../config/common");

const sendEmail = async ({ to, subject, text, html, attachments }) => {
  const transporter = nodemailer.createTransport({
    // host: "smtpout.secureserver.net",
    // port: 465,
    // secure: true,
    service: "gmail",
    auth: {
      user: commonOptions.company.email,
      pass: commonOptions.company.password,
    },
  });

  await transporter.verify();
  await transporter.sendMail({
    from: `${commonOptions.company.name} <${commonOptions.company.email}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });
};

module.exports = sendEmail;
