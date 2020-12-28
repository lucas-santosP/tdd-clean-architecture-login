class LoginRouter {
  route () {
    return { statusCode: 400 };
  }
}
describe("Login Router", () => {
  test("Should return 400 if no email is receive", () => {
    const sut = new LoginRouter(); // sut - system under test
    const httpRequest = {
      body: {
        password: "any_pass",
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
