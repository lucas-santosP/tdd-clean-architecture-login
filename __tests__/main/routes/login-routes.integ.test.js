import request from "supertest";
import bcrypt from "bcrypt";
import MongoHelper from "../../../src/infrastructure/helpers/mongo-helper";
import app from "../../../src/main/config/app";

let userModel;

describe("Login Routes", () => {
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

  test("Should return 200 when valid credentials are provided", async () => {
    await userModel.insertOne({
      email: "valid_email@mail.com",
      password: bcrypt.hashSync("hashed_password", 10),
    });

    await request(app)
      .post("/api/login")
      .send({ email: "valid_email@mail.com", password: "hashed_password" })
      .expect(200);
  });

  test("Should return 401 when invalid credentials are provided", async () => {
    await request(app)
      .post("/api/login")
      .send({ email: "valid_email@mail.com", password: "hashed_password" })
      .expect(401);
  });
});
