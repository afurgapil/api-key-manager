module.exports = function infoMail(name, lastname, email, message) {
  const mailOptions = {
    // TODO
    from: "your@mail.com",
    to: email,
    subject: "New Contact Form Submission",
    html: `<p>You have received a new message from ${name} ${lastname} (${email}): ${message}</p>`,
  };
  return mailOptions;
};
