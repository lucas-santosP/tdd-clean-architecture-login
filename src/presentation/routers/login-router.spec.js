class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || httpRequest.body) return { statusCode: 500 };

    const { email, password } = httpRequest.body;
    if (!email || !password) return { statusCode: 400 };
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

  test("Should return 500 if no httpRequest is receive", () => {
    const sut = new LoginRouter();
    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
  });
  test("Should return 500 if httpRequest has no body ", () => {
    const sut = new LoginRouter();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });
});
