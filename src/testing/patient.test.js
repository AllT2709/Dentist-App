const { api, getPatients, getPat } = require("../utils/helpers/herlper");
const db = require("../database/database");
const { server } = require("../app");

let tokenTest;

describe("Testing the patient enpoints", () => {
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
  describe("GET patients", () => {
    test("GET all patients from the database", async () => {
      let { allData } = await getPatients("Patient");
      let result = await api
        .get("/admin/patients")
        .set("Accept", "application/json")
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(result.body).toHaveLength(allData.length);
    });
    test("GET patient by id from the database", async () => {
      let { allData, id } = await getPatients("Patient");
      let patientSample = allData.filter((d) => d.Name === "TEST6");
      let result = await api
        .get(`/admin/patient/521346`)
        .set("Accept", "application/json")
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(result.body).toEqual(patientSample[0]);
      expect(result.body.id_patient).toEqual("521346");
      expect(id).toContain(result.body.id_patient);
    });
    test("GET Not found id from the database", async () => {
      let result = await api
        .get("/admin/patient/12344")
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(404);

      expect(result.body.err).toContain("No se encontro id");
      expect(result.body.err).toEqual("No se encontro id");
    });
  });
  describe("POST patients", () => {
    test("POST a new patient to the database", async () => {
      let patientBefore = await getPatients("Patient");
      let newPatient = {
        name: "Patient",
        avance: "avance",
      };
      let result = await api
        .post("/admin/patient")
        .send(newPatient)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .expect(201)
        .expect("Content-Type", /json/);

      let patoientAfter = await getPatients("Patient");

      expect(patoientAfter.allData).toHaveLength(
        patientBefore.allData.length + 1
      );
      expect(result.body[0][1]).toContain(newPatient.name.toUpperCase());
    });
    test("POST failed cause the patient name exist", async () => {
      let patientBefore = await getPatients("Patient");
      let newPatient = {
        name: "Patient",
        avance: "avance",
      };
      let result = await api
        .post("/admin/patient")
        .send(newPatient)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .expect(409)
        .expect("Content-Type", /json/);

      let patoientAfter = await getPatients("Patient");

      expect(patoientAfter.allData).toHaveLength(patientBefore.allData.length);
      expect(result.body.message).toContain("the patient exist");
    });
    test("POST failed cause is not complete the name camp", async () => {
      let patientBefore = await getPatients("Patient");
      let newPatient = {
        avance: "avance",
      };
      let result = await api
        .post("/admin/patient")
        .send(newPatient)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .expect(400)
        .expect("Content-Type", /json/);

      let patoientAfter = await getPatients("Patient");
      expect(patoientAfter.allData).toHaveLength(patientBefore.allData.length);
      expect(result.body).toEqual("Se require el campo nombre");
    });
  });
  describe("UPDATE patients", () => {
    test("UPDATE patient from database", async () => {
      let data = await getPat("Patient", "patient");
      let id = data.id_patient;
      let updatingPat = {
        name: "patient1",
        avance: "avance Nuevo",
      };
      await api
        .put(`/admin/patient/${id}`)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .send(updatingPat)
        .expect(200);

      let newData = await getPat("Patient", "patient1");
      expect(newData.id_patient).toEqual(id);
      expect(newData.Name).not.toEqual(data.Name);
      expect(newData.Name).toBe("PATIENT1");
    });
    test("UPDATE failed cause not found id or not exist", async () => {
      let res = await api
        .put(`/admin/patient/1234`)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .expect(404);
      expect(res.body.message).toEqual("Patient does not exist");
    });
    test("UPDATE failed cause not found id or not exist", async () => {
      let data = await getPat("Patient", "patient1");
      let id = data.id_patient;
      let updatingPat = {};
      let res = await api
        .put(`/admin/patient/${id}`)
        .set("Cookie", `jwt=${tokenTest}`)
        .set("Accept", "application/json")
        .send(updatingPat)
        .expect(404);
      expect(res.body.message).toEqual("You must provide data to update");
    });
  });
  describe("DELETE patient from database", () => {
    test("DELETING a patient from database", async () => {
      let data = await getPat("Patient", "patient1");
      let id = data.id_patient;
      let patientsBefore = await getPatients("Patient");
      await api
        .delete(`/admin/patient/${id}`)
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(204);

      let patientsAfter = await getPatients("Patient");
      expect(patientsAfter.allData).toHaveLength(
        patientsBefore.allData.length - 1
      );
      expect(patientsAfter.allData).not.toContain(data);
    });
    test("DELETE faild cause the patient does not exist", async () => {
      let patientsBefore = await getPatients("Patient");
      await api
        .delete(`/admin/patient/1234`)
        .set("Cookie", `jwt=${tokenTest}`)
        .expect(404);
      let patientsAfter = await getPatients("Patient");
      expect(patientsAfter.allData).toHaveLength(patientsBefore.allData.length);
    });
  });

  afterAll(() => {
    db.end();
    server.close();
  });
});
