import { Sequelize, DataTypes } from "sequelize";
import { MissingParamError } from "../../../../src/utils/generic-erros";

const sequelize = new Sequelize("sqlite::memory:", { logging: false });
let userModel;

class UserRepository {
  constructor (userModel) {
    this.userModel = userModel;
  }

  async findByEmail (email) {
    if (!email) throw new MissingParamError("email");
    if (!this.userModel) throw new MissingParamError("userModel");

    const user = await this.userModel.findOne({ where: { email } });
    return user;
  }
}

function makeSut () {
  const sut = new UserRepository(userModel);
  return { sut };
}

describe("User Repository", () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      sequelize.getQueryInterface().createTable("users", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        name: { type: DataTypes.TEXT, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });

      userModel = sequelize.define("user", {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
      });
    } catch (error) {
      console.log("Error connecting!", error);
    }
  });

  beforeEach(async () => {
    await userModel.destroy({ truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Find by email should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.findByEmail("invalid_email@email.com");

    expect(user).toBeNull();
  });

  test("Find by email should return an user if user is found", async () => {
    const { sut } = makeSut();
    const userData = { name: "any_name", email: "valid_email@email.com" };
    await userModel.create(userData);
    const user = await sut.findByEmail(userData.email);

    expect(user.email).toBe(userData.email);
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
