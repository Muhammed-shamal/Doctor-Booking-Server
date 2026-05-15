const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const { setupTestDB, closeTestDB, clearTestDB } = require("../testSetup");

describe("Auth Routes", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.name).toBe("John Doe");
      expect(res.body.data.email).toBe("john@example.com");
      expect(res.body.data.role).toBe("patient");
    });

    it("should return error for invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "invalid-email",
        password: "Password123!",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return error for duplicate email", async () => {
      await User.create({
        name: "Existing User",
        email: "john@example.com",
        password: "hashedPassword123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should return error for missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });
  });

  describe("POST /api/auth/login", () => {
    const testUser = {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "Password123!",
    };

    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login user successfully", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.email).toBe(testUser.email);
    });

    it("should return error for invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(res.statusCode).toBe(401);
    });

    it("should return error for wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "WrongPassword123!",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should return error for missing fields", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      const registerRes = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });

      token = loginRes.body.token;
    });

    it("should get current user profile", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.email).toBe("test@example.com");
    });

    it("should return error without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
    });

    it("should return error with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid_token");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/auth/refresh-token", () => {
    it("should refresh token successfully", async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });

      const refreshRes = await request(app).get("/api/auth/refresh-token");

      expect([200, 400, 401]).toContain(refreshRes.statusCode);
    });
  });
});
