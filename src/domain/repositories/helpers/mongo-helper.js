import { MongoClient } from "mongodb";

class MongoHelper {
  async connect (uri) {
    this.uri = uri;
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.client.db();
  }

  async disconnect () {
    await this.client.close();
    this.client = null;
    this.db = null;
  }

  async getCollection (name) {
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.uri);
    }
    return this.db.collection(name);
  }
}

export default new MongoHelper();
