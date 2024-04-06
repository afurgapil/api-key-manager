const generateUniqueId = require("../../utils/generateUniqueId");
//basicQueries
const checkIndexExists = require("../../utils/basicQueries/checkIndexExists");
jest.mock("../../utils/basicQueries/checkIndexExists");

describe("TC-002", () => {
  test("Generates a unique ID", async () => {
    checkIndexExists.mockReset();
    checkIndexExists.mockResolvedValueOnce(false);
    const id = await generateUniqueId();
    expect(id).toBeTruthy();
    expect(checkIndexExists).toHaveBeenCalledTimes(1);
  });
  test("Generates a new ID if checkIndexExists returns true", async () => {
    checkIndexExists.mockReset();
    checkIndexExists.mockResolvedValueOnce(true);
    checkIndexExists.mockResolvedValueOnce(false);
    const id = await generateUniqueId();
    expect(id).toBeTruthy();
    expect(checkIndexExists).toHaveBeenCalledTimes(2);
  });
});
