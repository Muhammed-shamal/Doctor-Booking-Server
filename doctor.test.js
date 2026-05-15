const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { setupTestDB, closeTestDB, clearTestDB } = require("../testSetup");

describe("Doctor Routes", () => {
  let adminToken;
  let userToken;
  let doctorId;

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
      role: "admin",
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
  });

  describe("GET /api/doctors", () => {
    beforeEach(async () => {
      const doctors = [
        {
          name: "Dr. Ahmed Smith",
          specialization: "Cardiology",
          experience: 10,
          consultationFee: 500,
          about: "Experienced cardiologist",
          isActive: true,
        },
        {
          name: "Dr. Sarah Johnson",
          specialization: "Dermatology",
          experience: 8,
          consultationFee: 400,
          about: "Skin specialist",
          isActive: true,
        },
        {
          name: "Dr. Ali Khan",
          specialization: "Orthopedics",
          experience: 12,
          consultationFee: 550,
          about: "Bone and joint expert",
          isActive: true,
        },
      ];

      await Doctor.insertMany(doctors);
    });

    it("should get all doctors", async () => {
      const res = await request(app)
        .get("/api/doctors")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(3);
    });

    it("should return empty array when no doctors", async () => {
      await Doctor.deleteMany({});

      const res = await request(app)
        .get("/api/doctors")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it("should return error without token", async () => {
      const res = await request(app).get("/api/doctors");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/doctors/:id", () => {
    let doctor;

    beforeEach(async () => {
      doctor = await Doctor.create({
        name: "Dr. Emma Davis",
        specialization: "Pediatrics",
        experience: 7,
        consultationFee: 450,
        about: "Children healthcare specialist",
        isActive: true,
      });
    });

    it("should get doctor by ID", async () => {
      const res = await request(app)
        .get(`/api/doctors/${doctor._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data.name).toBe("Dr. Emma Davis");
      expect(res.body.data.specialization).toBe("Pediatrics");
    });

    it("should return error for invalid ID", async () => {
      const res = await request(app)
        .get("/api/doctors/invalid_id")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should return error for non-existent doctor", async () => {
      const fakeId = require("mongoose").Types.ObjectId();

      const res = await request(app)
        .get(`/api/doctors/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /api/doctors", () => {
    it("should create doctor as admin", async () => {
      const newDoctor = {
        name: "Dr. Michael Brown",
        specialization: "Neurology",
        experience: 15,
        consultationFee: 600,
        about: "Brain and nervous system specialist",
      };

      const res = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newDoctor);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data.name).toBe(newDoctor.name);
      expect(res.body.data.specialization).toBe(newDoctor.specialization);
    });

    it("should return error when non-admin creates doctor", async () => {
      const newDoctor = {
        name: "Dr. John Doe",
        specialization: "Oncology",
        experience: 12,
        consultationFee: 700,
        about: "Cancer specialist",
      };

      const res = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newDoctor);

      expect(res.statusCode).toBe(403);
    });

    it("should return error for missing required fields", async () => {
      const res = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Dr. Incomplete",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should return error without token", async () => {
      const newDoctor = {
        name: "Dr. Test",
        specialization: "Surgery",
        experience: 10,
        consultationFee: 800,
      };

      const res = await request(app).post("/api/doctors").send(newDoctor);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /api/doctors/:id", () => {
    let doctor;

    beforeEach(async () => {
      doctor = await Doctor.create({
        name: "Dr. Original Name",
        specialization: "General Practice",
        experience: 5,
        consultationFee: 300,
        about: "General practitioner",
        isActive: true,
      });
    });

    it("should update doctor as admin", async () => {
      const updateData = {
        name: "Dr. Updated Name",
        specialization: "Internal Medicine",
        experience: 6,
        consultationFee: 350,
        about: "Internal medicine specialist",
      };

      const res = await request(app)
        .put(`/api/doctors/${doctor._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe("Dr. Updated Name");
      expect(res.body.data.consultationFee).toBe(350);
    });

    it("should return error when non-admin updates", async () => {
      const updateData = {
        name: "Dr. Hacked",
        consultationFee: 1000,
      };

      const res = await request(app)
        .put(`/api/doctors/${doctor._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(403);
    });

    it("should return error for non-existent doctor", async () => {
      const fakeId = require("mongoose").Types.ObjectId();

      const res = await request(app)
        .put(`/api/doctors/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test" });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/doctors/:id", () => {
    let doctor;

    beforeEach(async () => {
      doctor = await Doctor.create({
        name: "Dr. To Delete",
        specialization: "Psychiatry",
        experience: 9,
        consultationFee: 500,
        about: "Mental health specialist",
        isActive: true,
      });
    });

    it("should delete doctor as admin", async () => {
      const res = await request(app)
        .delete(`/api/doctors/${doctor._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);

      const deletedDoctor = await Doctor.findById(doctor._id);
      expect(deletedDoctor).toBeNull();
    });

    it("should return error when non-admin deletes", async () => {
      const res = await request(app)
        .delete(`/api/doctors/${doctor._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return error for non-existent doctor", async () => {
      const fakeId = require("mongoose").Types.ObjectId();

      const res = await request(app)
        .delete(`/api/doctors/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
