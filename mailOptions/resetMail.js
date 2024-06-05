module.exports = function resetMail(email, encodedEmail, code) {
  // TODO
  const resetCheckURL = "http://localhost:3001/reset/check";

  const mailOptions = {
    // TODO
    from: "your@mail.com",
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>Hello,</p>
      <p>To reset your password, click <a href="${resetCheckURL}/${encodedEmail}">here</a> or use the following code:</p>
      <p style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">${code}</p>
      <p>If you did not request a password reset, you can ignore this email.</p>
      <p>Best regards.</p>
    `,
  };
  return mailOptions;
};
