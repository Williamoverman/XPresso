import express from 'express';
import reservationController from '../controllers/reservation-controller.js';
import validator from '../middleware/validators.js';
import { Ad, Reservation, User } from '../db/database-helper.js';

const router = express.Router();

/**
 * @openapi
 * /reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get all reservations for a user
 *     description: Returns all reservations for a specific user.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *       - in: query
 *         name: ad_id
 *         schema:
 *           type: integer
 *         description: Filter reservations by ad ID
 *     responses:
 *       200:
 *         description: Reservations returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       403:
 *         description: Forbidden - not authorized
 *       404:
 *         description: User not found
 */
router.get('/',
    validator.validateId([
        { source: 'query', field: 'id' }
    ]),
    validator.checkIfExists([
        { model: User, source: 'query', field: 'id' }
    ]),
    validator.requireOwner('query', 'id'),
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
    validator.validateId(),
    validator.requireResourceOwner(Reservation, 'user_id'),
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
    validator.checkIfExists([
        { model: User, source: 'body', field: 'user_id' },
        { model: Ad, source: 'body', field: 'ad_id' }
    ]),
    validator.requireOwner('body', 'user_id'),
    validator.requireFields('start_date', 'end_date'),
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
    validator.checkIfExists([
        { model: User, source: 'body', field: 'user_id' },
        { model: Ad, source: 'body', field: 'ad_id' }
    ]),
    validator.requireOwner('body', 'user_id'),
    validator.requireFields('start_date', 'end_date'),
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
    validator.validateId(),
    validator.requireResourceOwner(Reservation, 'user_id'),
    reservationController.deleteReservation
);

export default router;