const express = require("express");

const router = express.Router();

const {
  createSchedule,
  getDoctorSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/schedule.controller");

const authorizeRoles = require("../middlewares/role.middleware");
const { scheduleValidation } = require("../validators/schedule");
const validate = require("../middlewares/validate.middleware");

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create doctor schedule
 *     description: Admin can create a doctor's schedule with slots.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - date
 *               - slots
 *             properties:
 *               doctor:
 *                 type: string
 *                 example: 6651d9e9c6f6e7a45f7c9999
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-20"
 *               slotDuration:
 *                 type: number
 *                 example: 30
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       example: "09:30"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden - Admin only
 *
 *       409:
 *         description: Schedule already exists
 */
router.post(
  "/",
  scheduleValidation,
  validate,
  authorizeRoles("admin"),
  createSchedule,
);

/**
 * @swagger
 * /api/schedules/{doctorId}:
 *   get:
 *     summary: Get doctor schedules
 *     description: Retrieve all schedules for a specific doctor.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6651d9e9c6f6e7a45f7c9999
 *     responses:
 *       200:
 *         description: List of doctor schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *
 *       404:
 *         description: Doctor or schedules not found
 *
 *       401:
 *         description: Unauthorized
 */
router.get("/doctor/:doctorId", getDoctorSchedules);

router.get("/:id", getScheduleById);

router.put(
  "/:id",
  scheduleValidation,
  validate,
  authorizeRoles("admin"),
  updateSchedule,
);

router.delete("/:id", authorizeRoles("admin"), deleteSchedule);

module.exports = router;
