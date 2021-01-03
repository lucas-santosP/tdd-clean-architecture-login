import { MissingParamError } from "../../utils/generic-erros";

export default class UserRepository {
  constructor (userModel) {
    this.userModel = userModel;
  }

  async findByEmail (email) {
    if (!email) throw new MissingParamError("email");
    if (!this.userModel) throw new MissingParamError("userModel");

    const user = await this.userModel.findOne(
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
    if (!this.userModel) throw new MissingParamError("userModel");

    await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } });
  }
}
