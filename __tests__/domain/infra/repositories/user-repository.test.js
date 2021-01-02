class UserRepository {
  async findByEmail (email) {
    return null;
  }
}

function makeSut () {
  const sut = new UserRepository();
  return { sut };
}

describe("User Repository", () => {
  test("Should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.findByEmail("invalid_email@email.com");
    expect(user).toBe(null);
  });
});
