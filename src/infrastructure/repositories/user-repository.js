import MongoHelper from "../helpers/mongo-helper";
import { MissingParamError } from "../../utils/generic-erros";

export default class UserRepository {
  async findByEmail (email) {
    if (!email) throw new MissingParamError("email");
    const userModel = await MongoHelper.getCollection("users");

    const user = await userModel.findOne(
      { email },
      {
        projection: {
          _id: 1,
          password: 1,
          email: 1,
        },
      },
    );
    return user;
  }

  async updateAccessToken (userId, accessToken) {
    if (!userId) throw new MissingParamError("userId");
    if (!accessToken) throw new MissingParamError("accessToken");
    const userModel = await MongoHelper.getCollection("users");

    await userModel.updateOne({ _id: userId }, { $set: { accessToken } });
  }
}
