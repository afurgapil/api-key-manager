const isValidEmail = require("../../utils/isValidMail");

describe("TC-015", () => {
  it("should return true for valid email addresses", () => {
    expect(isValidEmail("example@example.com")).toBe(true);
    expect(isValidEmail("test.user@example.com")).toBe(true);
    expect(isValidEmail("test123@example.com")).toBe(true);
    expect(isValidEmail("test@example.co.uk")).toBe(true);
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });

  it("should return false for invalid email addresses", () => {
    expect(isValidEmail("example@example")).toBe(false);
    expect(isValidEmail("example.com")).toBe(false);
    expect(isValidEmail("example@.com")).toBe(false);
    expect(isValidEmail("example.com@")).toBe(false);
    expect(isValidEmail("example@example@example.com")).toBe(false);
    expect(isValidEmail("example")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("example@")).toBe(false);
  });
});
