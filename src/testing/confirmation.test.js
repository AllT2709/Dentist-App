const { api, getPatients, getPat } = require("../utils/helpers/herlper");
const db = require("../database/database");
const { server } = require("../app");

describe("Testing confirmation date", () => {
  test("Testing the patient controller", async () => {
    let name = {
      name: "test6",
    };
    let res = await api.get("/patient-date").send(name).expect(200);

    expect(res.body.Name).toContain("TEST6");
  });
  test("Testing when there are not date", async () => {
    let name = {
      name: "test5",
    };
    let res = await api.get("/patient-date").send(name).expect(200);

    expect(res.body).toContain("there are not consult");
  });
  test("Testing failed cause there is not patient", async () => {
    let name = {
      name: "test3",
    };
    let res = await api.get("/patient-date").send(name).expect(400);

    expect(res.body).toContain("No está registrado en el sistema");
  });
  afterAll(() => {
    db.end();
    server.close();
  });
});
