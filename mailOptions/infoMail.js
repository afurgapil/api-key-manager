module.exports = function infoMail(name, lastname, email, message) {
  const mailOptions = {
    from: "adminmail",
    to: "adminmail",
    subject: "New Contact Form Submission",
    html: `<p>You have received a new message from ${name} ${lastname} (${email}): ${message}</p>`,
  };
  return mailOptions;
};
