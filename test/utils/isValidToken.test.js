const isValidToken = require("../../utils/isValidToken");
//basicQueries
const useUser = require("../../utils/basicQueries/useUser");
const mockData = require("../mockData");

jest.mock("../../utils/basicQueries/useUser");
jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      callback(null, {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (query.includes("SELECT")) {
            if (values.includes("999")) {
              callback(null, []);
            } else {
              const results = [{ url: "example1.com", key: "key1" }];
              callback(null, results);
            }
          }
        }),
        release: jest.fn(),
      });
    }),
  };
});
describe("TC-003", () => {
  jest.mock("../../utils/settings/usePool", () => {
    return {
      getConnection: jest.fn().mockImplementation((callback) => {
        callback(null, {
          query: jest.fn().mockImplementation((query, values, callback) => {
            const results = [{ url: "example.com", key: "123456" }];
            callback(null, results);
          }),
          release: jest.fn(),
        });
      }),
    };
  });

  test("Returns true for a valid token", async () => {
    const userId = "1";
    const validTokenUser = mockData.users.find((user) => user.id === userId);
    useUser.mockResolvedValueOnce(validTokenUser);
    const result = await isValidToken(
      validTokenUser.mail,
      validTokenUser.verification_code
    );
    expect(result).toBe(true);
  });

  test("Returns false for an invalid token", async () => {
    const userId = "2";
    const invalidTokenUser = mockData.users.find((user) => user.id === userId);
    useUser.mockResolvedValueOnce(invalidTokenUser);
    const result = await isValidToken(
      invalidTokenUser.mail,
      "invalid_verification_code"
    );
    expect(result).toBe(false);
  });
});
