import express from 'express';
import reviewController from '../controllers/review-controller.js';
import validator from '../middleware/validators.js';
import { ProPlayer, Reservation, Review, User } from '../db/database-helper.js';

const router = express.Router();

/**
 * @openapi
 * /reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews
 *     description: Returns all reviews.
 *     parameters:
 *       - in: query
 *         name: pro_player_id
 *         schema:
 *           type: integer
 *         description: Filter reviews by pro player ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter reviews by user ID
 *     responses:
 *       200:
 *         description: Reviews returned succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/', 
    reviewController.getAllReviews
);

/**
 * @openapi
 * /reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get review by ID
 *     description: Returns a review by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review
 *     responses:
 *       200:
 *         description: Review returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: If no review found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No review found by ID"
 */
router.get('/:id', 
    validator.validateId(),
    reviewController.getReviewById
);

/**
 * @openapi
 * /reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create review
 *     description: Returns created review.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
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
    validator.validateId([
        { source: 'body', field: 'reservation_id' },
        { source: 'body', field: 'user_id' },
        { source: 'body', field: 'pro_player_id' }
    ]),
    validator.checkIfExists([
        { model: Reservation, source: 'body', field: 'reservation_id' },
        { model: User, source: 'body', field: 'user_id' },
        { model: ProPlayer, source: 'body', field: 'pro_player_id' }
    ]),
    validator.requireAuth,
    validator.requireRoles(),
    validator.requireOwner('body', 'user_id'),
    validator.requireResourceOwner(Reservation, 'user_id', 'body', 'reservation_id'),
    validator.requireFields('rating'),
    validator.validateRating,
    reviewController.createReview
);

/**
 * @openapi
 * /reviews/{id}:
 *   patch:
 *     tags:
 *       - Reviews
 *     summary: Update review
 *     description: Returns updated review.
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
 *             $ref: '#/components/schemas/ReviewUpdate'
 *     responses:
 *       200:
 *         description: Review updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: If no review found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No review found by ID"
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
    validator.requireAuth,
    validator.requireRoles(),
    validator.requireResourceOwner(Review, 'user_id'),
    validator.requireFields('rating'),
    validator.validateRating,
    reviewController.updateReview
);

/**
 * @openapi
 * /reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Review deleted
 *       404:
 *         description: If no review found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example: 
 *                 error: 
 *                   "No review found by ID"
 */
router.delete('/:id', 
    validator.validateId(),
    validator.requireAuth,
    validator.requireRoles(),
    validator.requireResourceOwner(Review, 'user_id'),
    reviewController.deleteReview
);

export default router;