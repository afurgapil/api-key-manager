const logError = require("../../utils/basicQueries/logError");
const checkIndexExists = require("../../utils/basicQueries/checkIndexExists");

jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      const mockConnection = {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (values.includes("999")) {
            const err = new Error("Database connection failed");
            callback(err, null);
          } else if (values.includes("555")) {
            const err = new Error("An unexpected error occurred: ");
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
describe("TC-007", () => {
  beforeEach(() => {
    checkIndexExists.mockReset();
  });

  test("Should successfully log error if user exists", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "123";
    const pathId = "456";
    const message = "Test error message";

    const result = await logError(userId, pathId, message);
    expect(result.success).toBe(true);
    expect(result.message).toBe("Error log added successfully.");
  });

  test("Should fail to log error if user does not exist", async () => {
    checkIndexExists.mockResolvedValueOnce(false);
    const userId = "nonexistent_id";
    const pathId = "456";
    const message = "Test error message";
    await expect(logError(userId, pathId, message)).rejects.toThrow(
      "User not found"
    );
  });

  test("Should fail to log error on database connection error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);

    const userId = "999";
    const pathId = "456";
    const message = "Test error message";

    await expect(logError(userId, pathId, message)).rejects.toThrow(
      "Database connection failed"
    );
  });
  test("Should handle unexpected error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);

    const userId = "555";
    const pathId = "456";
    const message = "Test error message";

    await expect(logError(userId, pathId, message)).rejects.toThrowError(
      /An unexpected error occurred: /
    );
  });
});
