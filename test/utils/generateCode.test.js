const generateCode = require("../../utils/generateCode");
describe("TC-001", () => {
  test("Random code generated successfully returns a 6 digit number", async () => {
    expect.assertions(2);
    const code = await generateCode();
    expect(code).toBeGreaterThanOrEqual(100000);
    expect(code).toBeLessThan(1000000);
  });
});
