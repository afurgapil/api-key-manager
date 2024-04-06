const updateVerification = require("../../utils/basicQueries/updateVerification");
const pool = require("../../utils/settings/usePool");
const checkIndexExists = require("../../utils/basicQueries/checkIndexExists");
const generateCode = require("../../utils/generateCode");

jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      const mockConnection = {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (values.includes("123")) {
            const mockResult = {};
            callback(null, mockResult);
          } else if (values.includes("444")) {
            const updateQueryErr = new Error(
              "Error updating user verification status:"
            );
            callback(updateQueryErr, null);
          } else if (values.includes("555")) {
            const err = new Error("An unexpected error occured: ");
            callback(err, null);
          } else if (values.includes("999")) {
            const err = new Error("Database connection failed");
            callback(err, null);
          } else {
            const mockResult = {};
            callback(null, mockResult);
          }
        }),
        release: jest.fn(),
      };
      callback(null, mockConnection);
    }),
  };
});

jest.mock("../../utils/basicQueries/checkIndexExists");
jest.mock("../../utils/generateCode");

describe("TC-009", () => {
  beforeEach(() => {
    checkIndexExists.mockReset();
    generateCode.mockReset();
  });

  test("Should successfully update user verification status", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    generateCode.mockResolvedValueOnce("123456");
    const userId = "123";
    const status = true;

    const result = await updateVerification(userId, status);
    expect(result.success).toBe(true);
    expect(result.message).toBe(
      "User verification status updated successfully."
    );
    expect(result.code).toBe("123456");
  });

  test("Should fail to update user verification status if user does not exist", async () => {
    checkIndexExists.mockResolvedValueOnce(false);
    const userId = "nonexistent_id";
    const status = true;
    await expect(updateVerification(userId, status)).rejects.toThrow(
      "User not found"
    );
  });

  test("Should fail to update user verification status on database connection error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "999";
    const status = true;
    await expect(updateVerification(userId, status)).rejects.toThrow(
      "Database connection failed"
    );
  });
  test("Should handle unexpected error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "555";
    const status = true;
    await expect(updateVerification(userId, status)).rejects.toThrowError(
      "An unexpected error occured:"
    );
  });
  test("Should handle update query error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "444";
    const status = true;
    await expect(updateVerification(userId, status)).rejects.toThrowError(
      "Error updating user verification status:"
    );
  });
});
