const useKey = require("../../utils/basicQueries/useKey");
const pool = require("../../utils/settings/usePool");

jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      const mockConnection = {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (values.includes("123") && values.includes("456")) {
            const mockResult = [{ key: "test_key" }];
            callback(null, mockResult);
          } else if (values.includes("789") && values.includes("012")) {
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

describe("TC-011", () => {
  test("Should successfully retrieve key", async () => {
    const userId = "123";
    const pathId = "456";

    const result = await useKey(pathId, userId);
    expect(result.key).toBe("test_key");
  });

  test("Should fail to retrieve key if key does not exist", async () => {
    const userId = "789";
    const pathId = "012";

    await expect(useKey(pathId, userId)).rejects.toThrow("User key not found.");
  });

  test("Should fail to retrieve key on database query error", async () => {
    const userId = "999";
    const pathId = "888";

    await expect(useKey(pathId, userId)).rejects.toThrow(
      "Database query failed"
    );
  });
});
