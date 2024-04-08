const decrypt = require("../../utils/decrypt");

describe("TC-014", () => {
  it("should correctly decrypt the data", () => {
    const key = "secret";
    const encryptedData = "   aGVsbG8gd29ybGRzZWNyZXQ=";
    const expectedDecryptedData = "hello world";
    const result = decrypt(key, encryptedData);
    expect(result).toEqual(expectedDecryptedData);
  });

  it("should return an empty string if no data is provided", () => {
    const key = "secret";
    const encryptedData = "";
    const expectedDecryptedData = "";
    const result = decrypt(key, encryptedData);
    expect(result).toEqual(expectedDecryptedData);
  });

  it("should return an empty string if encrypted data is invalid", () => {
    const key = "secret";
    const encryptedData = "invalid";
    const expectedDecryptedData = "";
    const result = decrypt(key, encryptedData);
    expect(result).toEqual(expectedDecryptedData);
  });
});
