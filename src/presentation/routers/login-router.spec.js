class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) return { statusCode: 400 };
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

  test("Should return 400 if no password is receive", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
