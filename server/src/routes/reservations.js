import express from 'express';
import reservationController from '../controllers/reservation-controller.js';
const router = express.Router();

/**
 * @openapi
 * /reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get all reservations
 *     description: Returns all reservations.
 *     responses:
 *       200:
 *         description: Reservations returned succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/', reservationController.getAllReservations);

/**
 * @openapi
 * /reservations/{id}:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get reservation by ID
 *     description: Returns a reservation by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the reservation
 *     responses:
 *       200:
 *         description: Reservation returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: If no reservation found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No reservation found by ID"
 */
router.get('/:id', reservationController.getReservationById);

/**
 * @openapi
 * /reservations:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Create reservation
 *     description: Returns created reservation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Reservation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "start_date is required"
 */
router.post('/', reservationController.createReservation);

/**
 * @openapi
 * /reservations/{id}:
 *   put:
 *     tags:
 *       - Reservations
 *     summary: Update reservation
 *     description: Returns updated reservation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationUpdate'
 *     responses:
 *       200:
 *         description: Reservation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: If no reservation found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No reservation found by ID"
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "start_date is required"
 */
router.put('/:id', reservationController.updateReservation);

/**
 * @openapi
 * /reservations/{id}:
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Delete reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Reservation deleted
 *       404:
 *         description: If no reservation found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example: 
 *                 error: 
 *                   "No reservation found by ID"
 *       400:
 *         description: Cannot delete due to associated reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete reservation with associated reviews"
 */
router.delete('/:id', reservationController.deleteReservation);

/**
 * @openapi
 * /reservations/{id}/review:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get review for certain reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the reservation
 *     responses:
 *       200:
 *         description: List of reviews for certain reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: If no review found by that reservation ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No reviews found by reservation ID"
 */
router.get('/:id/review', reservationController.getReviewsForReservation);

export default router;