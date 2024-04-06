const usePath = require("../../utils/usePath");
const mockData = require("../mockData");
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
describe("TC-005", () => {
  test("Returns path information for given id", async () => {
    const userId = "1";
    const attr = ["url", "key"];
    const tempExpectedPath = mockData.paths.find(
      (path) => path.user_id === userId
    );
    const expectedPath = Object.keys(tempExpectedPath)
      .filter((key) => attr.includes(key))
      .reduce((obj, key) => {
        obj[key] = tempExpectedPath[key];
        return obj;
      }, {});
    const path = await usePath(userId);
    expect(path).toEqual(expectedPath);
  });

  test("Rejects with error if user not found", async () => {
    const userId = "999";
    try {
      await usePath(userId);
      fail("Function should have thrown an error");
    } catch (error) {
      expect(error.message).toEqual("User not found");
    }
  });
});
