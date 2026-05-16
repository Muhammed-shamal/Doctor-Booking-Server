const request = require("supertest");
const app = require("../app");
const { setupTestDB, closeTestDB, clearTestDB } = require("../testSetup");

/**
 * Integration Test Suite
 * Tests complete workflows across multiple routes
 */
describe("Integration Tests - Complete Workflow", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe("Complete Doctor Booking Workflow", () => {
    it("should complete full booking workflow: Register -> Login -> Create Doctor -> Create Schedule -> Book Appointment", async () => {
      // Step 1: Patient Registration
      const patientRegRes = await request(app).post("/api/auth/register").send({
        name: "John Patient",
        email: "john.patient@example.com",

        phone: "9895114836",
        address: "Rumas Quorters Palottupalli PO Mattanur",
        password: "PatientPass123!",
      });

      expect(patientRegRes.statusCode).toBe(201);
      const patientId = patientRegRes.body.data._id;
      let patientToken;

      // Step 2: Patient Login
      const patientLoginRes = await request(app).post("/api/auth/login").send({
        email: "john.patient@example.com",
        password: "PatientPass123!",
      });

      expect(patientLoginRes.statusCode).toBe(200);
      patientToken = patientLoginRes.body.token;

      // Step 3: Admin Registration
      const adminRegRes = await request(app).post("/api/auth/register").send({
        name: "Admin User",
        email: "admin@example.com",
        phone: "9446264086",
        address: "Rumas Quorters Palottupalli PO Mattanur",
        password: "AdminPass123!",
      });

      expect(adminRegRes.statusCode).toBe(201);
      let adminToken;

      // Step 4: Admin Login
      const adminLoginRes = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      expect(adminLoginRes.statusCode).toBe(200);
      adminToken = adminLoginRes.body.token;

      // Step 5: Admin Creates Doctor
      const doctorRes = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Dr. Elizabeth Wilson",
          specialization: "Family Medicine",
          experience: 12,
          consultationFee: 450,
          about: "Experienced family medicine practitioner",
        });

      expect(doctorRes.statusCode).toBe(201);
      const doctorId = doctorRes.body.data._id;

      // Step 6: Verify Doctor Appears in List
      const doctorsListRes = await request(app)
        .get("/api/doctors")
        .set("Authorization", `Bearer ${patientToken}`);

      expect(doctorsListRes.statusCode).toBe(200);
      expect(doctorsListRes.body.data.length).toBeGreaterThan(0);
      const createdDoctor = doctorsListRes.body.data.find(
        (d) => d._id === doctorId,
      );
      expect(createdDoctor).toBeDefined();

      // Step 7: Get Doctor Details
      const doctorDetailRes = await request(app)
        .get(`/api/doctors/${doctorId}`)
        .set("Authorization", `Bearer ${patientToken}`);

      expect(doctorDetailRes.statusCode).toBe(200);
      expect(doctorDetailRes.body.data.name).toBe("Dr. Elizabeth Wilson");

      // Step 8: Admin Creates Schedule
      const scheduleRes = await request(app)
        .post("/api/schedules")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          doctor: doctorId,
          date: "2026-06-15",
          slotDuration: 30,
          slots: [
            { startTime: "09:00", endTime: "09:30" },
            { startTime: "09:30", endTime: "10:00" },
            { startTime: "10:00", endTime: "10:30" },
            { startTime: "10:30", endTime: "11:00" },
            { startTime: "14:00", endTime: "14:30" },
            { startTime: "14:30", endTime: "15:00" },
            { startTime: "15:00", endTime: "15:30" },
          ],
        });

      expect(scheduleRes.statusCode).toBe(201);
      const scheduleId = scheduleRes.body.data._id;
      expect(scheduleRes.body.data.slots.length).toBe(7);

      // Step 9: Get Doctor Schedules
      const schedulesRes = await request(app)
        .get(`/api/schedules/${doctorId}`)
        .set("Authorization", `Bearer ${patientToken}`);

      expect(schedulesRes.statusCode).toBe(200);
      expect(schedulesRes.body.data.length).toBeGreaterThan(0);
      const retrievedSchedule = schedulesRes.body.data.find(
        (s) => s._id === scheduleId,
      );
      expect(retrievedSchedule).toBeDefined();

      // Step 10: Patient Books Appointment
      const slotId = scheduleRes.body.data.slots[0]._id;
      const bookRes = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          doctor: doctorId,
          schedule: scheduleId,
          slotId: slotId,
        });

      expect(bookRes.statusCode).toBe(201);
      const appointmentId = bookRes.body.data._id;
      expect(bookRes.body.data.status).toBe("pending");

      // Step 11: Patient Views Own Appointments
      const myAppointmentsRes = await request(app)
        .get("/api/appointments/my")
        .set("Authorization", `Bearer ${patientToken}`);

      expect(myAppointmentsRes.statusCode).toBe(200);
      expect(myAppointmentsRes.body.data.length).toBe(1);
      expect(myAppointmentsRes.body.data[0]._id).toBe(appointmentId);

      // Step 12: Admin Updates Appointment Status
      const updateStatusRes = await request(app)
        .patch(`/api/appointments/${appointmentId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "confirmed" });

      expect(updateStatusRes.statusCode).toBe(200);
      expect(updateStatusRes.body.data.status).toBe("confirmed");

      // Step 13: Patient Verifies Updated Status
      const updatedAppointmentRes = await request(app)
        .get("/api/appointments/my")
        .set("Authorization", `Bearer ${patientToken}`);

      expect(updatedAppointmentRes.statusCode).toBe(200);
      expect(updatedAppointmentRes.body.data[0].status).toBe("confirmed");

      // Step 14: Admin Completes Appointment
      const completeRes = await request(app)
        .patch(`/api/appointments/${appointmentId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "completed" });

      expect(completeRes.statusCode).toBe(200);
      expect(completeRes.body.data.status).toBe("completed");

      console.log("✅ Full booking workflow completed successfully");
    });

    it("should handle multiple patients booking with same doctor", async () => {
      // Setup: Create admin and doctor
      const adminRegRes = await request(app).post("/api/auth/register").send({
        name: "Admin",
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      const adminLoginRes = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      const adminToken = adminLoginRes.body.token;

      const doctorRes = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Dr. Popular",
          specialization: "Pediatrics",
          experience: 15,
          consultationFee: 400,
          about: "Popular pediatrician",
        });

      const doctorId = doctorRes.body.data._id;

      // Create schedule
      const scheduleRes = await request(app)
        .post("/api/schedules")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          doctor: doctorId,
          date: "2026-06-20",
          slotDuration: 30,
          slots: [
            { startTime: "09:00", endTime: "09:30" },
            { startTime: "09:30", endTime: "10:00" },
            { startTime: "10:00", endTime: "10:30" },
          ],
        });

      const scheduleId = scheduleRes.body.data._id;
      const slots = scheduleRes.body.data.slots;

      // Create 3 patients and book appointments
      const patients = [];
      for (let i = 1; i <= 3; i++) {
        const patientRegRes = await request(app)
          .post("/api/auth/register")
          .send({
            name: `Patient ${i}`,
            email: `patient${i}@example.com`,
            password: `Pass${i}123!`,
          });

        const patientLoginRes = await request(app)
          .post("/api/auth/login")
          .send({
            email: `patient${i}@example.com`,
            password: `Pass${i}123!`,
          });

        patients.push({
          id: patientRegRes.body.data._id,
          token: patientLoginRes.body.token,
        });

        const bookRes = await request(app)
          .post("/api/appointments/book")
          .set("Authorization", `Bearer ${patientLoginRes.body.token}`)
          .send({
            doctor: doctorId,
            schedule: scheduleId,
            slotId: slots[i - 1]._id,
          });

        expect(bookRes.statusCode).toBe(201);
        expect(bookRes.body.data.patient.toString()).toBe(
          patientRegRes.body.data._id,
        );
      }

      // Verify all patients have their appointments
      for (let i = 0; i < patients.length; i++) {
        const appointmentsRes = await request(app)
          .get("/api/appointments/my")
          .set("Authorization", `Bearer ${patients[i].token}`);

        expect(appointmentsRes.statusCode).toBe(200);
        expect(appointmentsRes.body.data.length).toBe(1);
        expect(appointmentsRes.body.data[0].patient.toString()).toBe(
          patients[i].id,
        );
      }

      console.log(
        "✅ Multiple patient booking workflow completed successfully",
      );
    });

    it("should prevent duplicate admin operations by non-admin", async () => {
      // Create patient
      const patientRegRes = await request(app).post("/api/auth/register").send({
        name: "Patient",
        email: "patient@example.com",
        phone: "9895114836",
        address: "Rumas Quorters Palottupalli PO Mattanur",
        password: "Pass123!",
      });

      const patientLoginRes = await request(app).post("/api/auth/login").send({
        email: "patient@example.com",
        password: "Pass123!",
      });

      const patientToken = patientLoginRes.body.token;

      // Patient tries to create doctor (should fail)
      const doctorRes = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          name: "Fake Doctor",
          specialization: "Unknown",
          experience: 0,
          consultationFee: 100,
        });

      expect(doctorRes.statusCode).toBe(403);

      console.log("✅ Authorization checks working correctly");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle expired or invalid tokens", async () => {
      const res = await request(app)
        .get("/api/doctors")
        .set("Authorization", "Bearer invalid.token.here");

      expect(res.statusCode).toBe(401);
    });

    it("should handle missing authorization header", async () => {
      const res = await request(app).get("/api/doctors");

      expect(res.statusCode).toBe(401);
    });

    it("should handle malformed request bodies", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: 123, // Should be string
        email: "test@example.com",
        password: "Pass123!",
      });

      expect([400, 422]).toContain(res.statusCode);
    });
  });
});
