const express = require("express");

const router = express.Router();

const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointment.controller");

const authorizeRoles = require("../middlewares/role.middleware");

const validate = require("../middlewares/validate.middleware");
const { appointmentValidation } = require("../validators/appointment");

/**
 * @swagger
 * /api/appointments/book:
 *   post:
 *     summary: Book an appointment
 *     description: Patient can book a doctor appointment using a schedule slot.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - schedule
 *               - slotId
 *             properties:
 *               doctor:
 *                 type: string
 *                 example: 6651d9e9c6f6e7a45f7c2222
 *
 *               schedule:
 *                 type: string
 *                 example: 6651d9e9c6f6e7a45f7c3333
 *
 *               slotId:
 *                 type: string
 *                 example: 6651d9e9c6f6e7a45f7c4444
 *
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *
 *       400:
 *         description: Validation error or slot unavailable
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only patients can book appointments
 *
 *       404:
 *         description: Schedule or doctor not found
 */

router.post(
  "/book",
  appointmentValidation,
  validate,
  authorizeRoles("patient"),
  bookAppointment,
);

/**
 * @swagger
 * /api/appointments/my:
 *   get:
 *     summary: Get my appointments
 *     description: Patient can retrieve all their appointments.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: List of patient appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only patients can access this route
 */

router.get("/my", authorizeRoles("patient"), getMyAppointments);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     description: Admin can update appointment status.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6652a7f3d8b4e6c12ab34567
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - confirmed
 *                   - completed
 *                   - cancelled
 *                 example: confirmed
 *
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *
 *       400:
 *         description: Invalid status
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin only
 *
 *       404:
 *         description: Appointment not found
 */

router.patch("/:id/status", authorizeRoles("admin"), updateAppointmentStatus);

module.exports = router;
