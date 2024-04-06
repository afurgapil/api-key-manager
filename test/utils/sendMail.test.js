const sendMail = require("../../utils/sendMail");
jest.mock("../../utils/settings/useTransporter", () => {
  return {
    sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
      callback(null, { response: "Email sent successfully" });
    }),
  };
});
describe("TC-004", () => {
  test("Should send an email successfully", async () => {
    const mailOptions = {
      from: "sender@example.com",
      to: "receiver@example.com",
      subject: "Test Email",
      text: "This is a test email.",
    };

    const result = await sendMail(mailOptions);

    expect(result).toEqual({ response: "Email sent successfully" });
  });
});
