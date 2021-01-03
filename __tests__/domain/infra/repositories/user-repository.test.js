import MongoHelper from "../../../../src/domain/infra/helpers/mongo-helper";
import UserRepository from "../../../../src/domain/infra/repositories/user-repository.js";
import { MissingParamError } from "../../../../src/utils/generic-erros";

let userModel;

function makeSut () {
  const sut = new UserRepository(userModel);
  return { sut, userModel };
}

describe("User Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    userModel = await MongoHelper.getCollection("users");
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Find by email should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.findByEmail("invalid_email@email.com");

    expect(user).toBeNull();
  });

  test("Find by email should return an user if user is found", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({
      name: "any_name",
      email: "valid_email@email.com",
      password: "hashed_password",
    });
    const user = await sut.findByEmail("valid_email@email.com");

    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password,
      email: fakeUser.ops[0].email,
    });
  });

  test("Find by email should throw if no email is received", async () => {
    const { sut } = makeSut();
    const promise = sut.findByEmail();

    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Find by email should throw if no userModel is received", async () => {
    const sut = new UserRepository();
    const promise = sut.findByEmail("valid_email@email.com");

    await expect(promise).rejects.toThrow(new MissingParamError("userModel"));
  });
});
