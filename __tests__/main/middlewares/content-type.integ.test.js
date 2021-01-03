import request from "supertest";
import app from "../../../src/main/config/app";

describe("Content Type", () => {
  test("Should return json content-type as default", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send("");
    });

    await request(app).get("/test_content_type").expect("content-type", /json/);
  });
});
