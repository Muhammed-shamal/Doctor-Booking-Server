const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Schedule = require("../models/Schedule");
const { setupTestDB, closeTestDB, clearTestDB } = require("../testSetup");

describe("Schedule Routes", () => {
  let adminToken;
  let userToken;
  let doctor;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Create admin user
    const adminRes = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "AdminPass123!",
    });

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "AdminPass123!",
    });

    adminToken = adminLoginRes.body.token;

    // Create regular user
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Regular User",
      email: "user@example.com",
      password: "UserPass123!",
    });

    const userLoginRes = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "UserPass123!",
    });

    userToken = userLoginRes.body.token;

    // Create doctor
    doctor = await Doctor.create({
      name: "Dr. Schedule Test",
      specialization: "General Practice",
      experience: 8,
      consultationFee: 400,
      about: "Test doctor for scheduling",
      isActive: true,
    });
  });

  describe("POST /api/schedules", () => {
    it("should create schedule as admin", async () => {
      const scheduleData = {
        doctor: doctor._id.toString(),
        date: "2026-05-25",
        slotDuration: 30,
        slots: [
          { startTime: "09:00", endTime: "09:30" },
          { startTime: "09:30", endTime: "10:00" },
          { startTime: "10:00", endTime: "10:30" },
          { startTime: "14:00", endTime: "14:30" },
          { startTime: "14:30", endTime: "15:00" },
        ],
      };

      const res = await request(app)
        .post("/api/schedules")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(scheduleData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.doctor.toString()).toBe(doctor._id.toString());
      expect(res.body.data.slots.length).toBe(5);
    });

    it("should return error when non-admin creates schedule", async () => {
      const scheduleData = {
        doctor: doctor._id.toString(),
        date: "2026-05-25",
        slotDuration: 30,
        slots: [{ startTime: "09:00", endTime: "09:30" }],
      };

      const res = await request(app)
        .post("/api/schedules")
        .set("Authorization", `Bearer ${userToken}`)
        .send(scheduleData);

      expect(res.statusCode).toBe(403);
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app)
        .post("/api/schedules")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          doctor: doctor._id.toString(),
        });

      expect(res.statusCode).toBe(400);
    });

    it("should return error for invalid doctor ID", async () => {
      const scheduleData = {
        doctor: require("mongoose").Types.ObjectId().toString(),
        date: "2026-05-25",
        slotDuration: 30,
        slots: [{ startTime: "09:00", endTime: "09:30" }],
      };

      const res = await request(app)
        .post("/api/schedules")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(scheduleData);

      expect([400, 404]).toContain(res.statusCode);
    });

    it("should return error without token", async () => {
      const scheduleData = {
        doctor: doctor._id.toString(),
        date: "2026-05-25",
        slots: [{ startTime: "09:00", endTime: "09:30" }],
      };

      const res = await request(app).post("/api/schedules").send(scheduleData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/schedules/:doctorId", () => {
    let schedule;

    beforeEach(async () => {
      schedule = await Schedule.create({
        doctor: doctor._id,
        date: new Date("2026-05-25"),
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
        ],
      });
    });

    it("should get doctor schedules", async () => {
      const res = await request(app)
        .get(`/api/schedules/${doctor._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].slots.length).toBe(3);
    });

    it("should return empty array for doctor with no schedules", async () => {
      const newDoctor = await Doctor.create({
        name: "Dr. No Schedules",
        specialization: "Dermatology",
        experience: 5,
        consultationFee: 350,
      });

      const res = await request(app)
        .get(`/api/schedules/${newDoctor._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it("should return error for invalid doctor ID", async () => {
      const res = await request(app)
        .get("/api/schedules/invalid_id")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should return error without token", async () => {
      const res = await request(app).get(`/api/schedules/${doctor._id}`);

      expect(res.statusCode).toBe(401);
    });
  });
});
