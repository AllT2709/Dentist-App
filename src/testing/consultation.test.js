const { api, getConsultations, getDate } = require("../utils/helpers/herlper");
const db = require("../database/database");
const { server } = require("../app");

let tokenTest;

describe("Testing consultation endpoints", () => {
  beforeEach((done) => {
    let admin = {
      name: "adminTest",
      password: "passTest",
    };
    api
      .post("/admin")
      .send(admin)
      .set("Accept", "application/json")
      .end((err, res) => {
        tokenTest = res.body.token;
        done();
      });
  });
  describe("GET consults ", () => {
    test("GET all consult from database", async () => {
      let data = await getConsultations("Consultation");
      let res = await api
        .get("/admin/consult/consults")
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(200)
        .expect("Content-Type", /json/);
      expect(res.body).toHaveLength(data.length);
      expect(res.body[0].id_consultation).toEqual(data[0].id_consultation);
    });
    test("GET consultations by day", async () => {
      let day = {
        fecha: "2021-07-16",
      };
      let data = await getConsultations("Consultation");
      let res = await api
        .get("/admin/consult")
        .set("Cookie", `jwt=${tokenTest}`)
        .send(day)
        .expect(200)
        .expect("Content-Type", /json/);
      let dates = data.map((d) => d.fecha_consulta.toJSON());
      let datesRes = res.body.map((r) => r.fecha_consulta);
      expect(dates[0]).toEqual(datesRes[0]);
      expect(dates).toContain(datesRes[0]);
    });
    test("GET is empty cuase there are not consultation", async () => {
      let date = new Date();
      let day = {
        fecha: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      };
      let data = await getConsultations("Consultation");
      let res = await api
        .get("/admin/consult")
        .set("Cookie", `jwt=${tokenTest}`)
        .send(day)
        .expect(200)
        .expect("Content-Type", /json/);
      expect(res.body).toContain("there are not consultations this day");
    });
  });
  describe("POST new date to the database", () => {
    test("POST  a new consult ", async () => {
      let date = new Date();
      let body = {
        name: "test2",
        monto: 150,
        fecha: `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      };
      let res = await api
        .post("/admin/consult")
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .send(body)
        .expect(201)
        .expect("Content-Type", /json/);

      expect(res.body.message).toContain("consultation created");
    });
    test("POST failed cause patient does not exist", async () => {
      let body = {
        name: "test",
        monto: 150,
      };
      let res = await api
        .post("/admin/consult")
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .send(body)
        .expect(500)
        .expect("Content-Type", /json/);

      expect(res.body.err).toEqual("Patient does not exist");
    });
  });
  describe("UPDATE date from the database", () => {
    test("PUT the date", async () => {
      let dateToUpdate = await getDate("Consultation", "test2");
      let id = dateToUpdate[0].id_consultation;
      let date = new Date();
      let body = {
        monto: 151,
        fecha: `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      };
      await api
        .put(`/admin/consult/${id}`)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .send(body)
        .expect(200)
        .expect("Content-Type", /json/);

      let dateUpdated = await getDate("Consultation", "test2");
      expect(dateUpdated[0].Monto).not.toEqual(dateToUpdate[0].Monto);
    });
    test("PUT failed cause not provides the paramenters", async () => {
      let dateToUpdate = await getDate("Consultation", "test2");
      let id = dateToUpdate[0].id_consultation;
      let body = {};
      let res = await api
        .put(`/admin/consult/${id}`)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .send(body)
        .expect(404)
        .expect("Content-Type", /json/);

      let dateUpdated = await getDate("Consultation", "test2");
      expect(res.body.message).toEqual("You must provide data to update");
      expect(dateUpdated[0].Monto).toEqual(dateToUpdate[0].Monto);
    });
    test("PUT failed cause not consultation does not exist", async () => {
      let dateToUpdate = await getDate("Consultation", "test2");
      let body = {};
      let res = await api
        .put(`/admin/consult/1234`)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .send(body)
        .expect(404)
        .expect("Content-Type", /json/);
      let dateUpdated = await getDate("Consultation", "test2");
      expect(res.body.message).toEqual("Date does not exist");
      expect(dateUpdated[0].Monto).toEqual(dateToUpdate[0].Monto);
    });
  });
  describe("DELETE date from database", () => {
    test("DELETE consultation from database", async () => {
      let dateToUpdate = await getDate("Consultation", "test2");
      let id = dateToUpdate[0].id_consultation;
      let consultsBefore = await getConsultations("Consultation");
      await api
        .delete(`/admin/consult/${id}`)
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(204);
      let consultsAfter = await getConsultations("Consultation");
      expect(consultsAfter).toHaveLength(consultsBefore.length - 1);
    });
    test("DELETE failed cause date does not exist", async () => {
      let consultsBefore = await getConsultations("Consultation");
      await api
        .delete(`/admin/consult/1234`)
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(404);
      let consultsAfter = await getConsultations("Consultation");
      expect(consultsAfter).toHaveLength(consultsBefore.length);
    });
  });
  afterAll(() => {
    db.end();
    server.close();
  });
});
