import express from 'express';
import reservationController from '../controllers/reservation-controller.js';
import validator from '../middleware/validators.js';

const router = express.Router();

/**
 * @openapi
 * /reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get all reservations
 *     description: Returns all reservations.
 *     parameters:
 *       - in: query
 *         name: ad_id
 *         schema:
 *           type: string
 *         description: Filter reservations by ad ID
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
router.get('/',
    validator.requireAuth,
    validator.requireOwner,
    reservationController.getAllReservations
);

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
router.get('/:id', 
    validator.requireAuth,
    validator.requireOwner,
    validator.validateId,
    reservationController.getReservationById
);

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
 *                   example: "Dates, user and ad are required"
 */
router.post('/', 
    validator.requireAuth,
    validator.requireOwner,
    validator.validateDates,
    reservationController.createReservation
);

/**
 * @openapi
 * /reservations/{id}:
 *   patch:
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
 *                   example: "Start date and end date have to be valid inputs"
 */
router.patch('/:id', 
    validator.requireAuth,
    validator.requireOwner,
    validator.validateId,
    validator.validateDates,
    reservationController.updateReservation
);

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
 */
router.delete('/:id', 
    validator.requireAuth,
    validator.requireOwner,
    validator.validateId,
    reservationController.deleteReservation
);

export default router;