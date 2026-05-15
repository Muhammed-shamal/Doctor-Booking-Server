const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Schedule = require("../models/Schedule");
const Appointment = require("../models/Appointment");
const { setupTestDB, closeTestDB, clearTestDB } = require("../testSetup");

describe("Appointment Routes", () => {
  let patientToken;
  let adminToken;
  let patientId;
  let adminId;
  let doctor;
  let schedule;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Create patient user
    const patientRes = await request(app).post("/api/auth/register").send({
      name: "Patient User",
      email: "patient@example.com",
      password: "PatientPass123!",
    });

    patientId = patientRes.body.data._id;

    const patientLoginRes = await request(app).post("/api/auth/login").send({
      email: "patient@example.com",
      password: "PatientPass123!",
    });

    patientToken = patientLoginRes.body.token;

    // Create admin user
    const adminRes = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "AdminPass123!",
    });

    adminId = adminRes.body.data._id;

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "AdminPass123!",
    });

    adminToken = adminLoginRes.body.token;

    // Create doctor
    doctor = await Doctor.create({
      name: "Dr. Appointment Test",
      specialization: "General Practice",
      experience: 10,
      consultationFee: 500,
      about: "Test doctor for appointments",
      isActive: true,
    });

    // Create schedule with slots
    schedule = await Schedule.create({
      doctor: doctor._id,
      date: new Date("2026-06-01"),
      slotDuration: 30,
      slots: [
        {
          startTime: "09:00",
          endTime: "09:30",
          isBooked: false,
        },
        {
          startTime: "09:30",
          endTime: "10:00",
          isBooked: false,
        },
        {
          startTime: "10:00",
          endTime: "10:30",
          isBooked: false,
        },
        {
          startTime: "14:00",
          endTime: "14:30",
          isBooked: false,
        },
      ],
    });
  });

  describe("POST /api/appointments/book", () => {
    it("should book appointment as patient", async () => {
      const appointmentData = {
        doctor: doctor._id.toString(),
        schedule: schedule._id.toString(),
        slotId: schedule.slots[0]._id.toString(),
      };

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${patientToken}`)
        .send(appointmentData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.patient.toString()).toBe(patientId);
      expect(res.body.data.doctor.toString()).toBe(doctor._id.toString());
      expect(res.body.data.status).toBe("pending");
    });

    it("should return error when non-patient books", async () => {
      const appointmentData = {
        doctor: doctor._id.toString(),
        schedule: schedule._id.toString(),
        slotId: schedule.slots[0]._id.toString(),
      };

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(appointmentData);

      expect(res.statusCode).toBe(403);
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          doctor: doctor._id.toString(),
        });

      expect(res.statusCode).toBe(400);
    });

    it("should return error for invalid schedule ID", async () => {
      const appointmentData = {
        doctor: doctor._id.toString(),
        schedule: require("mongoose").Types.ObjectId().toString(),
        slotId: schedule.slots[0]._id.toString(),
      };

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${patientToken}`)
        .send(appointmentData);

      expect([400, 404]).toContain(res.statusCode);
    });

    it("should return error without token", async () => {
      const appointmentData = {
        doctor: doctor._id.toString(),
        schedule: schedule._id.toString(),
        slotId: schedule.slots[0]._id.toString(),
      };

      const res = await request(app)
        .post("/api/appointments/book")
        .send(appointmentData);

      expect(res.statusCode).toBe(401);
    });

    it("should book multiple appointments on different slots", async () => {
      // Book first slot
      const res1 = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          doctor: doctor._id.toString(),
          schedule: schedule._id.toString(),
          slotId: schedule.slots[0]._id.toString(),
        });

      expect(res1.statusCode).toBe(201);

      // Book second slot with different patient
      const patient2Res = await request(app).post("/api/auth/register").send({
        name: "Patient Two",
        email: "patient2@example.com",
        password: "Patient2Pass123!",
      });

      const patient2LoginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: "patient2@example.com",
          password: "Patient2Pass123!",
        });

      const res2 = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${patient2LoginRes.body.token}`)
        .send({
          doctor: doctor._id.toString(),
          schedule: schedule._id.toString(),
          slotId: schedule.slots[1]._id.toString(),
        });

      expect(res2.statusCode).toBe(201);
    });
  });

  describe("GET /api/appointments/my", () => {
    let appointment;

    beforeEach(async () => {
      appointment = await Appointment.create({
        patient: patientId,
        doctor: doctor._id,
        schedule: schedule._id,
        slot: schedule.slots[0],
        status: "pending",
      });
    });

    it("should get patient's appointments", async () => {
      const res = await request(app)
        .get("/api/appointments/my")
        .set("Authorization", `Bearer ${patientToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].patient.toString()).toBe(patientId);
    });

    it("should return empty array for patient with no appointments", async () => {
      const newPatientRes = await request(app).post("/api/auth/register").send({
        name: "New Patient",
        email: "newpatient@example.com",
        password: "NewPass123!",
      });

      const newPatientLoginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: "newpatient@example.com",
          password: "NewPass123!",
        });

      const res = await request(app)
        .get("/api/appointments/my")
        .set("Authorization", `Bearer ${newPatientLoginRes.body.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it("should return error when non-patient accesses", async () => {
      const res = await request(app)
        .get("/api/appointments/my")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return error without token", async () => {
      const res = await request(app).get("/api/appointments/my");

      expect(res.statusCode).toBe(401);
    });

    it("should return multiple appointments for patient", async () => {
      // Create second appointment
      await Appointment.create({
        patient: patientId,
        doctor: doctor._id,
        schedule: schedule._id,
        slot: schedule.slots[1],
        status: "confirmed",
      });

      const res = await request(app)
        .get("/api/appointments/my")
        .set("Authorization", `Bearer ${patientToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe("PATCH /api/appointments/:id/status", () => {
    let appointment;

    beforeEach(async () => {
      appointment = await Appointment.create({
        patient: patientId,
        doctor: doctor._id,
        schedule: schedule._id,
        slot: schedule.slots[0],
        status: "pending",
      });
    });

    it("should update appointment status as admin", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${appointment._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "confirmed" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data.status).toBe("confirmed");
    });

    it("should return error for invalid status", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${appointment._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "invalid_status" });

      expect(res.statusCode).toBe(400);
    });

    it("should return error when non-admin updates", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${appointment._id}/status`)
        .set("Authorization", `Bearer ${patientToken}`)
        .send({ status: "completed" });

      expect(res.statusCode).toBe(403);
    });

    it("should return error for non-existent appointment", async () => {
      const fakeId = require("mongoose").Types.ObjectId();

      const res = await request(app)
        .patch(`/api/appointments/${fakeId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "completed" });

      expect(res.statusCode).toBe(404);
    });

    it("should return error without token", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${appointment._id}/status`)
        .send({ status: "confirmed" });

      expect(res.statusCode).toBe(401);
    });

    it("should update to all valid statuses", async () => {
      const statuses = ["pending", "confirmed", "completed", "cancelled"];

      for (const status of statuses) {
        const res = await request(app)
          .patch(`/api/appointments/${appointment._id}/status`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ status });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe(status);
      }
    });
  });
});
