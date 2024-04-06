const usageTracker = require("../../utils/basicQueries/usageTracker");
const pool = require("../../utils/settings/usePool");

jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      const mockConnection = {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (values.includes("123") && values.includes("456")) {
            const mockResult = {};
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

describe("TC-010", () => {
  test("Should successfully track API usage", async () => {
    const userId = "123";
    const pathId = "456";

    const result = await usageTracker(userId, pathId);
    expect(result).toBe(true);
  });

  test("Should fail to track API usage on database query error", async () => {
    const userId = "789";
    const pathId = "012";

    await expect(usageTracker(userId, pathId)).rejects.toThrow(
      "Database query failed"
    );
  });
});
