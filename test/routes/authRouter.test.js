const request = require("supertest");
const server = require("../server");
const bcrypt = require("bcrypt");
const pool = require("../../utils/settings/usePool");
const useUser = require("../../utils/basicQueries/useUser");
const updateVerification = require("../../utils/basicQueries/updateVerification");
const updateUser = require("../../utils/basicQueries/updateUser");
const sendMail = require("../../utils/sendMail");
const decrypt = require("../../utils/decrypt");
const isValidToken = require("../../utils/isValidToken");
jest.mock("bcrypt");
jest.mock("../../utils/settings/usePool");
jest.mock("../../utils/basicQueries/useUser");
jest.mock("../../utils/basicQueries/updateUser");
jest.mock("../../utils/basicQueries/updateVerification");
jest.mock("../../utils/sendMail");
jest.mock("../../utils/encrypt");
jest.mock("../../utils/decrypt");
jest.mock("../../utils/isValidToken");

describe("TC-016", () => {
  beforeEach(() => {
    bcrypt.genSalt.mockClear();
    pool.getConnection.mockClear();
  });
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });
  it("1-Should sign up a user successfully", async () => {
    bcrypt.genSalt.mockImplementation((saltRounds, callback) =>
      callback(null, "testSalt")
    );
    bcrypt.hash.mockImplementation((data, salt, callback) =>
      callback(null, "hashedPassword")
    );
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) =>
          callback(null, { insertId: 1, affectedRows: 1 }),
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signup").send({
      username: "testUser",
      password: "testPassword",
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: "Success",
      data: {
        id: expect.any(String),
        username: "testUser",
        mail: "test@mail.com",
      },
    });
  });

  it("2-Should return 400 if required fields are missing", async () => {
    const requiredFields = ["username", "password", "mail"];

    for (const field of requiredFields) {
      const mockReqBody = {
        username: "Gafur",
        password: "Apil",
        mail: "test@example.com",
      };
      delete mockReqBody[field];

      const response = await request(server)
        .post("/auth/signup")
        .send(mockReqBody);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "Invalid parameter." });
    }
  });

  it("3-Should return 409 if username already exists", async () => {
    useUser.mockResolvedValueOnce({
      username: "existingUsername",
    });
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) => {
          if (params.includes("existingUsername")) {
            callback(null, [{ length: 1 }]);
          } else {
            callback(null, { insertId: 1, affectedRows: 1 });
          }
        },
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signup").send({
      username: "existingUsername",
      password: "testPassword",
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({ error: "Username already exists." });
  });

  it("4-Should return 400 if email invalid", async () => {
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) => {
          if (params.includes("invalidmail")) {
            callback(null, { length: 1 });
          } else {
            callback(null, { insertId: 1, affectedRows: 1 });
          }
        },
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signup").send({
      username: "testUsername",
      password: "testPassword",
      mail: "invalidmail",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "E-Mail is invalid." });
  });

  it("5-Should return appropriate status code and error message if database error occured", async () => {
    pool.getConnection.mockImplementation((callback) =>
      callback(new Error("Database connection failed."))
    );

    const response = await request(server).post("/auth/signup").send({
      username: "databaseTestUser",
      password: "testPassword",
      mail: "test@gmail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Database connection failed./
    );
  });

  it("6-Should return 500 if an unexpected error occured", async () => {
    pool.getConnection.mockImplementation((callback) =>
      callback(new Error("Error during registration."))
    );

    const response = await request(server).post("/auth/signup").send({
      username: "testUsername",
      password: "testPassword",
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Error during registration./
    );
  });

  it("7-Should return 500 if error generating salt", async () => {
    bcrypt.genSalt.mockImplementation((saltRounds, callback) =>
      callback(new Error("Error generating salt."))
    );

    const response = await request(server).post("/auth/signup").send({
      username: "testUsername",
      password: "testPassword",
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Error during registration./
    );
  });

  it("8-Should return 500 if error hashing password", async () => {
    bcrypt.hash.mockImplementation((data, salt, callback) =>
      callback(new Error("Hashing error."))
    );

    const response = await request(server).post("/auth/signup").send({
      username: "testUsername",
      password: "testPassword",
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Error during registration/
    );
  });

  it("9.1-Should return 500 if username exceeds maximum character limit", async () => {
    const longUsername = "a".repeat(33);

    const response = await request(server).post("/auth/signup").send({
      username: longUsername,
      password: "testPassword",
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Error during registration/
    );
  });

  it("9.2-Should return 500 if username exceeds minimum character limit", async () => {
    const shortUsername = "a";

    const response = await request(server).post("/auth/signup").send({
      username: shortUsername,
      password: "testPassword",
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Error during registration/
    );
  });

  it("9.3-Should return 500 if password exceeds minimum character limit", async () => {
    const shortPassword = "a";

    const response = await request(server).post("/auth/signup").send({
      username: "testUser",
      password: shortPassword,
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Error during registration/
    );
  });

  it("9.4-Should return 500 if password exceeds maximum character limit", async () => {
    const longPassword = "a".repeat(256);

    const response = await request(server).post("/auth/signup").send({
      username: "testUser",
      password: longPassword,
      mail: "test@mail.com",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toMatch(
      /An error occurred\.Error during registration/
    );
  });
});

describe("TC-017", () => {
  beforeEach(() => {
    pool.getConnection.mockClear();
  });
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it("1-Should sign in user successfully", async () => {
    bcrypt.compare.mockImplementation((password, hashedPassword, callback) =>
      callback(null, true)
    );
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) =>
          callback(null, [
            {
              id: 1,
              username: "testUser",
              mail: "test@mail.com",
              tier: "bronze",
            },
          ]),
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual({
      id: 1,
      username: "testUser",
      mail: "test@mail.com",
      tier: "bronze",
    });
  });

  it("2-Should return 400 if required fields are missing", async () => {
    const requiredFields = ["username", "password"];

    for (const field of requiredFields) {
      const mockReqBody = {
        username: "Gafur",
        password: "Apil",
      };

      delete mockReqBody[field];
      const response = await request(server)
        .post("/auth/signin")
        .send(mockReqBody);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "Invalid parameter." });
    }
  });

  it("3-Should return 401 if user not found", async () => {
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) => callback(null, []),
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signin").send({
      username: "nonexistentUser",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "User not found." });
  });

  it("4-Should return 401 if user is not verified", async () => {
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) =>
          callback(null, [
            {
              id: 1,
              username: "testUser",
              mail: "test@mail.com",
              is_verificated: 0,
              tier: "basic",
            },
          ]),
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Please verificate your mail." });
  });

  it("5-Should return 401 if password is incorrect", async () => {
    bcrypt.compare.mockImplementation((password, hashedPassword, callback) =>
      callback(null, false)
    );
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) =>
          callback(null, [
            {
              id: 1,
              username: "testUser",
              mail: "test@mail.com",
              is_verificated: 1,
              tier: "basic",
              password: "hashedPassword",
            },
          ]),
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: "incorrectPassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Incorrect password." });
  });

  it("6-Should return 500 if database connection fails", async () => {
    pool.getConnection.mockImplementation((callback) =>
      callback(new Error("Database connection failed."))
    );

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Database connection failed." });
  });

  it("7-Should return 500 if unable to retrieve user information", async () => {
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) =>
          callback(new Error("Unable to retrieve user information.")),
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: "Unable to retrieve user information.",
    });
  });

  it("8-Should return 500 if bcrypt comparison fails", async () => {
    bcrypt.compare.mockImplementation((password, hashedPassword, callback) =>
      callback(new Error("Password comparison error."))
    );
    pool.getConnection.mockImplementation((callback) =>
      callback(null, {
        query: (sql, params, callback) =>
          callback(null, [
            {
              id: 1,
              username: "testUser",
              mail: "test@mail.com",
              is_verificated: 1,
              tier: "basic",
              password: "hashedPassword",
            },
          ]),
        release: () => {},
      })
    );

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: "Password comparison error.",
    });
  });

  it("9-Should return 500 if an unexpected error occured", async () => {
    bcrypt.compare.mockImplementation((password, hashedPassword, callback) =>
      callback(null, true)
    );
    pool.getConnection.mockImplementation((callback) =>
      callback(null, new Error("An error occured."))
    );

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred.",
    });
  });

  it("10.1-Should return 400 if username exceeds maximum character limit", async () => {
    const longUsername = "a".repeat(33);

    const response = await request(server).post("/auth/signin").send({
      username: longUsername,
      password: "testPassword",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      "Username length should be between 4 and 32 characters."
    );
  });

  it("10.2-Should return 400 if username exceeds minimum character limit", async () => {
    const shortUsername = "a";

    const response = await request(server).post("/auth/signin").send({
      username: shortUsername,
      password: "testPassword",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      "Username length should be between 4 and 32 characters."
    );
  });

  it("10.3-Should return 400 if password exceeds minimum character limit", async () => {
    const shortPassword = "a";

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: shortPassword,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      "Password length should be between 8 and 255 characters."
    );
  });

  it("10.4-Should return 400 if password exceeds maximum character limit", async () => {
    const longPassword = "a".repeat(256);

    const response = await request(server).post("/auth/signin").send({
      username: "testUser",
      password: longPassword,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      "Password length should be between 8 and 255 characters."
    );
  });
});

describe("TC-018", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it("1-Should return 200 if account is successfully verified", async () => {
    const userId = "validUserId";
    const verificationCode = "validVerificationCode";

    useUser.mockResolvedValueOnce({
      verification_code: verificationCode,
    });
    updateVerification.mockResolvedValueOnce({
      success: true,
      message: "User verification status updated successfully.",
      code: verificationCode,
    });
    const response = await request(server)
      .patch(`/auth/verify/${userId}`)
      .send({ verificationCode: verificationCode });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Account successfully verified.",
    });
  });

  it("2-Should return 400 if invalid parameter is provided", async () => {
    const response = await request(server)
      .patch("/auth/verify/nonexistentUserId")
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Invalid parameter." });
  });

  it("3-Should return 404 if user is not found", async () => {
    const userId = "nonexistentUserId";
    const verificationCode = "validVerificationCode";

    useUser.mockResolvedValueOnce(null);

    const response = await request(server)
      .patch(`/auth/verify/${userId}`)
      .send({ verificationCode });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: "User not found." });
  });

  it("4-Should return 401 if invalid verification code is provided", async () => {
    const userId = "validUserId";
    const invalidVerificationCode = "invalidVerificationCode";

    useUser.mockResolvedValueOnce({
      verification_code: "validVerificationCode",
    });

    const response = await request(server)
      .patch(`/auth/verify/${userId}`)
      .send({ verificationCode: invalidVerificationCode });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Invalid verification code." });
  });

  it("5-Should return 200 if account is already verified", async () => {
    const userId = "verifiedUserId";
    const verificationCode = "validVerificationCode";

    useUser.mockResolvedValueOnce({
      verification_code: verificationCode,
      is_verificated: 1,
    });
    const response = await request(server)
      .patch(`/auth/verify/${userId}`)
      .send({ verificationCode });

    // expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Account already verified." });
  });

  it("6-Should return 500 if an unexpected error occurs", async () => {
    const userId = "validUserId";
    const verificationCode = "validVerificationCode";

    useUser.mockRejectedValueOnce(new Error("Unexpected error"));

    const response = await request(server)
      .patch(`/auth/verify/${userId}`)
      .send({ verificationCode });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "An unexpected error occurred." });
  });
});

describe("TC-019", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it("1-Should return 200 and send reset password instructions to the email", async () => {
    const email = "test@example.com";

    useUser.mockResolvedValueOnce({ id: "validUserId", mail: email });
    updateVerification.mockResolvedValueOnce({ success: true, code: "123456" });
    sendMail.mockResolvedValueOnce();

    const response = await request(server)
      .patch("/auth/reset/request")
      .send({ email });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Reset password instructions sent to your email.",
    });
  });

  it("2-Should return 400 if request body is invalid", async () => {
    const requiredFields = ["email"];

    for (const field of requiredFields) {
      const mockReqBody = {
        email: "test@mail.com",
      };

      delete mockReqBody[field];
      const response = await request(server)
        .patch("/auth/reset/request")
        .send(mockReqBody);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "Invalid request body." });
    }
  });

  it("3-Should return 404 if user is not found", async () => {
    const email = "nonexistent@example.com";

    useUser.mockResolvedValueOnce(null);

    const response = await request(server)
      .patch("/auth/reset/request")
      .send({ email });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "User not found." });
  });

  it("4-Should return 500 if an unexpected error occurs", async () => {
    const email = "nonexistent@example.com";
    useUser.mockResolvedValueOnce({ id: "validUserId", mail: email });

    pool.getConnection.mockImplementation((callback) =>
      callback(new Error("Error resetting the password."))
    );

    const response = await request(server)
      .patch("/auth/reset/request")
      .send({ email });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Error resetting the password." });
  });
});

describe("TC-020", () => {
  afterEach(() => {
    bcrypt.genSalt.mockClear();
    jest.clearAllMocks();
  });
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it("1-Should return 200 and reset password successfully", async () => {
    bcrypt.genSalt.mockImplementation((saltRounds, callback) =>
      callback(null, "testSalt")
    );
    bcrypt.hash.mockImplementation((data, salt, callback) =>
      callback(null, "hashedPassword")
    );
    const mail = "encodedMail";
    const token = "validToken";
    const newPassword = "newPassword";

    decrypt.mockReturnValueOnce("decodedMail");
    useUser.mockResolvedValueOnce({ id: "validUserId" });
    updateUser.mockResolvedValueOnce();
    updateVerification.mockResolvedValueOnce({
      success: true,
    });
    isValidToken.mockResolvedValueOnce();
    const response = await request(server)
      .patch(`/auth/reset/check/${mail}`)
      .send({ token, newPassword });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Password reset successfully." });
  });

  it("2-Should return 400 if parameters are invalid", async () => {
    const requiredFields = ["token", "newPassword"];

    for (const field of requiredFields) {
      const mockReqBody = {
        token: "token",
        newPassword: "amazingPassword",
      };

      delete mockReqBody[field];
      const response = await request(server)
        .patch("/auth/reset/check/encodedMail")
        .send(mockReqBody);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "Invalid parameter." });
    }
  });

  it("3-Should return 401 if token is invalid or expired", async () => {
    const mail = "encodedMail";
    const token = "invalidToken";
    const newPassword = "newPassword";

    decrypt.mockReturnValueOnce("decodedMail");
    isValidToken.mockReturnValueOnce(false);

    const response = await request(server)
      .patch(`/auth/reset/check/${mail}`)
      .send({ token, newPassword });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Invalid or expired token." });
  });
  //TODO check it
  // it("4-Should return 500 if an error occurs during the process", async () => {
  //   const mockMail = "encodedMail";
  //   const mockToken = "validToken";
  //   const mockNewPassword = "newPassword";
  //   bcrypt.genSalt.mockImplementation((saltRounds, callback) =>
  //     callback(null, "testSalt")
  //   );
  //   bcrypt.hash.mockImplementation((data, salt, callback) =>
  //     callback(null, "hashedPassword")
  //   );
  //   decrypt.mockReturnValueOnce("decodedmail@mail.com");
  //   isValidToken.mockReturnValueOnce(true);
  //   useUser.mockResolvedValueOnce({ id: "validUserId" });
  //   updateUser.mockRejectedValueOnce(new Error("Update user failed"));

  //   const response = await request(server)
  //     .patch(`/auth/reset/check/${mockMail}`)
  //     .send({ token: mockToken, newPassword: mockNewPassword });

  //   expect(response.statusCode).toBe(500);
  //   expect(response.body).toEqual({ error: "An error occurred." });
  // });
});
