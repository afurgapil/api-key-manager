const request = require("supertest");
const server = require("../server");
const sendMail = require("../../utils/sendMail");
const infoMail = require("../../mailOptions/infoMail");
const isValidMail = require("../../utils/isValidMail");

jest.mock("../../utils/sendMail");
jest.mock("../../utils/isValidMail");
jest.mock("../../mailOptions/infoMail");
jest.mock("../../utils/settings/useTransporter");

describe("TC-021", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });
  it("1-Should return 200 and success message if email is sent successfully", async () => {
    const mockReqBody = {
      name: "Gafur",
      lastname: "Apil",
      email: "test@example.com",
      message: "Test message",
    };

    const mockMailOptions = {
      from: "sender@example.com",
      to: "receiver@example.com",
      subject: "Test Subject",
      text: "Test message",
    };

    infoMail.mockReturnValueOnce(mockMailOptions);
    sendMail.mockResolvedValueOnce();
    isValidMail.mockResolvedValueOnce(true);
    const response = await request(server)
      .post("/contact/send-mail")
      .send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User message saved successfully.",
    });
  });

  it("2-Should return 404 and error message if email sending fails", async () => {
    const mockMailOptions = {
      from: "admintest@mail.com",
      to: "usertest@mail.com",
      subject: "Test",
      html: `<p>Hi,this is a test.</p>`,
    };
    const mockReqBody = {
      name: "Gafur",
      lastname: "Apil",
      email: "test@example.com",
      message: "Test message",
    };
    sendMail.mockRejectedValueOnce(
      new Error("An error occured while sending mail.")
    );
    infoMail.mockResolvedValueOnce(mockMailOptions);
    isValidMail.mockResolvedValueOnce(true);

    const response = await request(server)
      .post("/contact/send-mail")
      .send(mockReqBody);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "An error occured while sending mail.",
    });
  });

  it("3-Should return 400 if any required field is missing in the request body", async () => {
    const requiredFields = ["name", "lastname", "email", "message"];

    for (const field of requiredFields) {
      const mockReqBody = {
        name: "Gafur",
        lastname: "Apil",
        email: "test@example.com",
        message: "Test message",
      };

      delete mockReqBody[field];

      const response = await request(server)
        .post("/contact/send-mail")
        .send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid request body." });
    }
  });

  it("4-Should return 400 if email format is invalid in the request body", async () => {
    const mockReqBody = {
      name: "Gafur",
      lastname: "Apil",
      email: "invalidMail",
      message: "Test message",
    };

    const response = await request(server)
      .post("/contact/send-mail")
      .send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid email format." });
  });
  //it("5-Should return 500 if an unexpected error occurs in sendMail function", async () => {});
});
