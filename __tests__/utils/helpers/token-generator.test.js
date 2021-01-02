function makeSut () {
  class TokenGenerator {
    async generate () {
      return null;
    }
  }
  const sut = new TokenGenerator();
  return { sut };
}

describe("Token Generator", () => {
  test("Should return null if JWT returns null", async () => {
    const { sut } = makeSut();
    const token = await sut.generate("any_id");

    expect(token).toBe(null);
  });
});
