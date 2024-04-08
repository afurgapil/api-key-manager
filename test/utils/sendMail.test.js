const sendMail = require("../../utils/sendMail");
const useTransporter = require("../../utils/settings/useTransporter");
jest.mock("../../utils/settings/useTransporter");

describe("TC-004", () => {
  test("Should send an email successfully", async () => {
    useTransporter.sendMail.mockImplementation((mailOptions, callback) => {
      callback(null, { response: "Email sent successfully" });
    });
    const mailOptions = {
      from: "sender@example.com",
      to: "receiver@example.com",
      subject: "Test Email",
      text: "This is a test email.",
    };

    const result = await sendMail(mailOptions);

    expect(result).toEqual({ response: "Email sent successfully" });
  });
  test("should reject with error if sending email fails", async () => {
    const mockError = new Error("Failed to send email");
    useTransporter.sendMail.mockImplementation((mailOptions, callback) => {
      callback(mockError, null);
    });
    const mockMailOptions = {
      from: "admintest@mail.com",
      to: "usertest@mail.com",
      subject: "Test",
      html: `<p>Hi,this is a test.</p>`,
    };

    await expect(sendMail(mockMailOptions)).rejects.toThrowError(mockError);
  });
});
