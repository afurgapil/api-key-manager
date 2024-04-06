const updateUser = require("../../utils/basicQueries/updateUser");
const pool = require("../../utils/settings/usePool");
const checkIndexExists = require("../../utils/basicQueries/checkIndexExists");

jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      const mockConnection = {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (values.includes("123")) {
            const mockResult = {};
            callback(null, mockResult);
          } else if (values.includes("444")) {
            const updateQueryErr = new Error("Error in query");
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

describe("TC-008", () => {
  beforeEach(() => {
    checkIndexExists.mockReset();
  });

  test("Should successfully update user value", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "123";
    const column = "email";
    const value = "test@example.com";

    const result = await updateUser(userId, column, value);
    expect(result.success).toBe(true);
    expect(result.message).toBe("User value updated successfully.");
    expect(result.column).toBe(value);
  });

  test("Should fail to update user value if user does not exist", async () => {
    checkIndexExists.mockResolvedValueOnce(false);
    const userId = "nonexistent_id";
    const column = "email";
    const value = "test@example.com";
    await expect(updateUser(userId, column, value)).rejects.toThrow(
      "User not found"
    );
  });

  test("Should fail to update user value on database connection error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "999";
    const column = "email";
    const value = "test@example.com";
    await expect(updateUser(userId, column, value)).rejects.toThrow(
      "Database connection failed"
    );
  });
  test("Should handle unexpected error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "555";
    const column = "email";
    const value = "test@example.com";
    await expect(updateUser(userId, column, value)).rejects.toThrowError(
      "An unexpected error occured: "
    );
  });
  test("Should handle update query error", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "444";
    const column = "email";
    const value = "test@example.com";
    await expect(updateUser(userId, column, value)).rejects.toThrowError(
      "Error in query"
    );
  });
});
