it("2-Should return 400 if request body is invalid", async () => {
  const requiredFields = ["email"];

  for (const field of requiredFields) {
    const mockReqBody = {
      email: "test@mail.com",
    };

    delete mockReqBody[field];
    const response = await request(server)
      .patch("/auth/reset/request")
      .send(mockReqBody);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Invalid request body." });
  }
});
