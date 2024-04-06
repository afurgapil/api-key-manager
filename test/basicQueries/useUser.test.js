const useUser = require("../../utils/basicQueries/useUser");
const pool = require("../../utils/settings/usePool");

jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      const mockConnection = {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (values.includes("test@example.com")) {
            const mockResult = [{ id: "123", email: "test@example.com" }];
            callback(null, mockResult);
          } else if (values.includes("456")) {
            const mockResult = [];
            callback(null, mockResult);
          } else {
            const err = new Error("Database query failed");
            callback(err, null);
          }
        }),
        release: jest.fn(),
      };
      callback(null, mockConnection);
    }),
  };
});

describe("TC-012", () => {
  test("Should successfully retrieve user by email", async () => {
    const type = "email";
    const value = "test@example.com";

    const result = await useUser(type, value);
    expect(result.id).toBe("123");
    expect(result.email).toBe("test@example.com");
  });

  test("Should successfully retrieve user by ID", async () => {
    const type = "id";
    const value = "456";

    await expect(useUser(type, value)).rejects.toThrow("User not found.");
  });

  test("Should fail to retrieve user on database query error", async () => {
    const type = "username";
    const value = "test_user";

    await expect(useUser(type, value)).rejects.toThrow("Database query failed");
  });
});
