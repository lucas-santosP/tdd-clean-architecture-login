import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize("sqlite::memory:", { logging: false });
let userModel;

function makeSut () {
  class UserRepository {
    constructor (userModel) {
      this.userModel = userModel;
    }

    async findByEmail (email) {
      const user = await this.userModel.findOne({ where: { email } });
      return user;
    }
  }

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

  test("Should return null if no user is found", async () => {
    const { sut } = makeSut(userModel);
    const user = await sut.findByEmail("invalid_email@email.com");

    expect(user).toBeNull();
  });

  test("Should return an user if user is found", async () => {
    const { sut } = makeSut(userModel);
    const userData = { name: "any_name", email: "valid_email@email.com" };
    await userModel.create(userData);
    const user = await sut.findByEmail(userData.email);

    expect(user.email).toBe(userData.email);
  });
});
