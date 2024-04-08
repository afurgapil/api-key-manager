const encrypt = require("../../utils/encrypt");

describe("TC-013", () => {
  it("should correctly encrypt the data", () => {
    const data = "hello world";
    const key = "secret";
    const comparedData = data + key;
    const expectedEncodedData = Buffer.from(comparedData, "utf8").toString(
      "base64"
    );
    const result = encrypt(comparedData);
    expect(result).toEqual(expectedEncodedData);
  });

  it("should return an empty string if no data is provided", () => {
    const result = encrypt("");
    expect(result).toEqual("");
  });
});
