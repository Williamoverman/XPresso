import express from 'express';
import reservationController from '../controllers/reservation-controller.js';
import validator from '../middleware/validators.js';
import reservationChecker from '../middleware/reservation-checks.js';
import { Ad, Reservation, User } from '../db/database-helper.js';

const router = express.Router();

/**
 * @openapi
 * /reservations/admin/all:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get all reservations (Admin only)
 *     description: Returns all reservations in the system. Admin only.
 *     responses:
 *       200:
 *         description: All reservations returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/admin/all',
    validator.requireRoles('Admin'),
    reservationController.getAllReservationsAdmin
);

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
    validator.requireRoles('User', 'ProPlayer'),
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
    validator.requireRoles('User', 'ProPlayer'),
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
 *                   example: "Missing required fields:"
 */
router.post('/',
    validator.requireRoles('User', 'ProPlayer'),
    validator.checkIfExists([
        { model: User, source: 'body', field: 'user_id' },
        { model: Ad, source: 'body', field: 'ad_id' }
    ]),
    validator.requireOwner('body', 'user_id'),
    validator.requireFields('start_date', 'end_date'),
    validator.validateDates,
    reservationChecker.checkAvailableSpots,
    reservationChecker.checkReservationDuration,
    reservationChecker.checkUserReservationLimit,
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
 *                   example: "Missing required fields:"
 */
router.patch('/:id', 
    validator.requireRoles('User', 'ProPlayer'),
    validator.checkIfExists([
        { model: Reservation, source: 'params', field: 'id' }
    ]),
    validator.requireResourceOwner(Reservation, 'user_id', 'user', 'id'),
    validator.validateDates,
    reservationChecker.checkReservationDuration,
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
    validator.requireRoles('User', 'ProPlayer'),
    validator.requireResourceOwner(Reservation, 'user_id'),
    reservationController.deleteReservation
);

export default router;