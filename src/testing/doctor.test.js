const { api } = require("../utils/helpers/herlper");
const { getPerson, getPatient } = require("../utils/getPerson");
const db = require("../database/database");
const { server } = require("../app");
let tokenTest;

describe("Testing login and loguot to Doctor", () => {
  test("Login to the admin landing", async () => {
    let admin = {
      name: "adminTest",
      password: "passTest",
    };
    let res = await api
      .post("/admin")
      .send(admin)
      .set("Accept", "application/json")
      .expect(200);
    tokenTest = res.body.token;
    expect(res.body.message).toEqual("logeado!");
  });
  test("Login to the admin landing", async () => {
    let admin = {
      password: "passTest12",
    };
    let res = await api
      .post("/admin")
      .send(admin)
      .set("Accept", "application/json")
      .expect(400);
    expect(res.body).toContain("nombre o  contraseña invalidos");
  });
  test("logout testing", async () => {
    await api
      .get("/admin/logout")
      .set("Cookie", `jwt=${tokenTest}`)
      .expect(200);
  });
  test("logout testing", async () => {
    let res = await api.get("/admin/logout").expect(401);
  });
  test("Register a new doctor admin", async () => {
    let body = {
      name: "DTest",
      password: "test123",
    };
    let res = await api
      .post("/admin/register")
      .set("Accept", "application/json")
      .send(body)
      .expect(201);
  });
  test("Register failed a new doctor admin", async () => {
    let body = {
      name: "adminTest",
      password: "test123",
    };
    let res = await api
      .post("/admin/register")
      .set("Accept", "application/json")
      .send(body)
      .expect(400);

    expect(res.body).toContain("Ese usuario ya esxiste");
  });
  test("Register failed cause require parameters", async () => {
    let body = {};
    let res = await api
      .post("/admin/register")
      .set("Accept", "application/json")
      .send(body)
      .expect(400);

    expect(res.body).toContain("Require parameters");
  });
  test("GET Doctors from database", async () => {
    let res = await api
      .get("/admin/doctor")
      .set("Cookie", `jwt=${tokenTest}`)
      .expect(200)
      .expect("Content-Type", /json/);
  });
  test("delete Doctors from database", async () => {
    let doctorBefore = await getPatient("Doctor");
    let doctor = await getPerson("Doctor", "DTest");
    let id = doctor.id;
    await api
      .delete(`/admin/doctor/${id}`)
      .set("Cookie", `jwt=${tokenTest}`)
      .expect(204);
    let doctorAfter = await getPatient("Doctor");
    expect(doctorAfter).toHaveLength(doctorBefore.length - 1);
  });
  afterAll(() => {
    db.end();
    server.close();
  });
});
