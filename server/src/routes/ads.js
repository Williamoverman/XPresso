import express from 'express';
import adController from '../controllers/ad-controller.js';
import validator from '../middleware/validators.js';
import { Ad, Game, ProPlayer } from '../db/database-helper.js';

const router = express.Router();

/**
 * @openapi
 * /ads:
 *   get:
 *     tags:
 *       - Ads
 *     summary: Get all ads
 *     description: Returns all ads. Filterable by service type, pro player and game
 *     parameters:
 *       - in: query
 *         name: service_type
 *         schema:
 *           type: string
 *         description: Filter ads by service type
 *       - in: query
 *         name: game_id
 *         schema:
 *           type: integer
 *         description: Filter ads by game ID
 *       - in: query
 *         name: pro_player_id
 *         schema:
 *           type: integer
 *         description: Filter ads by pro player ID
 *       - in: query
 *         name: with_spots
 *         schema:
 *           type: boolean
 *         description: Include spots available
 *     responses:
 *       200:
 *         description: Ads returned succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ad'
 */
router.get('/', 
    adController.getAllAds
);

/**
 * @openapi
 * /ads/{id}:
 *   get:
 *     tags:
 *       - Ads
 *     summary: Get ad by ID
 *     description: Returns a ad by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the ad
 *     responses:
 *       200:
 *         description: Ad returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ad'
 *       404:
 *         description: If no ad found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No ad found by ID"
 */
router.get('/:id', 
    validator.validateId([
        {source: 'params', field: 'id'}
    ]),
    adController.getAdById
);

/**
 * @openapi
 * /ads:
 *   post:
 *     tags:
 *       - Ads
 *     summary: Create ad
 *     description: Returns created ad.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdInput'
 *     responses:
 *       201:
 *         description: Ad created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ad'
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
 *       404:
 *         description: Game or pro player not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Game not found"
 */
router.post('/', 
    validator.validateId([
        {source: 'body', field: 'game_id'},
        {source: 'body', field: 'pro_player_id'}
    ]),
    validator.checkIfExists([
        {model: Game, source: 'body', field: 'game_id'},
        {model: ProPlayer, source: 'body', field: 'pro_player_id'}
    ]),
    validator.requireAuth,
    validator.requireOwner('body', 'pro_player_id'),
    validator.requireRoles('ProPlayer'),
    validator.requireFields('name', 'max_reservations_per_user', 'service_type', 'total_spots_available', 'max_duration_minutes'),
    validator.checkIfAdNameExists,
    validator.validatePositiveNumber('max_reservations_per_user', 'total_spots_available', 'max_duration_minutes'),
    adController.createAd
);

/**
 * @openapi
 * /ads/{id}:
 *   patch:
 *     tags:
 *       - Ads
 *     summary: Update ad
 *     description: Returns updated ad.
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
 *             $ref: '#/components/schemas/AdUpdate'
 *     responses:
 *       200:
 *         description: Ad updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ad'
 *       404:
 *         description: If no ad found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No ad found by ID"
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
    validator.requireResourceOwner(Ad, 'pro_player_id'),
    validator.requireRoles('ProPlayer'),
    validator.checkIfAdNameExists,
    validator.validatePositiveNumber('max_reservations_per_user', 'total_spots_available', 'max_duration_minutes'),
    adController.updateAd
);

/**
 * @openapi
 * /ads/{id}:
 *   delete:
 *     tags:
 *       - Ads
 *     summary: Delete ad
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ad deleted
 *       404:
 *         description: If no ad found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example: 
 *                 error: 
 *                   "No ad found by ID"
 *       400:
 *         description: Cannot delete due to associated reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete ad with associated reservations"
 */
router.delete('/:id', 
    validator.validateId(),
    validator.requireAuth,
    validator.requireResourceOwner(Ad, 'pro_player_id'),
    validator.requireRoles('ProPlayer'),
    adController.deleteAd
);

export default router;