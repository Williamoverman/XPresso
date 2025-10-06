import express from 'express';
import proPlayerController from '../controllers/pro-player-controller.js';
import validator from '../middleware/validators.js';
import { Game } from '../db/database-helper.js';

const router = express.Router();

/**
 * @openapi
 * /pro-players:
 *   get:
 *     tags:
 *       - Pro-players
 *     summary: Get all pro-players
 *     description: Returns all pro-players.
 *     responses:
 *       200:
 *         description: Pro-players returned succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProPlayer'
 */
router.get('/', 
    proPlayerController.getAllProPlayers
);

/**
 * @openapi
 * /pro-players/{id}:
 *   get:
 *     tags:
 *       - Pro-players
 *     summary: Get pro-player by user_id
 *     description: Returns a pro-player by user_id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user_id of the pro-player
 *     responses:
 *       200:
 *         description: Pro-player returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProPlayer'
 *       404:
 *         description: If no pro-player found by user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No pro-player found by user_id"
 */
router.get('/:id', 
    validator.validateId(),
    proPlayerController.getProPlayerById
);

/**
 * @openapi
 * /pro-players/{id}:
 *   post:
 *     tags:
 *       - Pro-players
 *     summary: Create pro-player
 *     description: Returns created pro-player.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user_id of the pro-player
 *     responses:
 *       201:
 *         description: Pro-player created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProPlayer'
 *       400:
 *         description: Invalid input or pro player already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "This user is already registered as a pro player"
 */
router.post('/:id', 
    validator.validateId(),
    validator.requireAuth,
    validator.requireOwner(),
    validator.requireRoles('User'),
    proPlayerController.createProPlayer
);

/**
 * @openapi
 * /pro-players/{id}:
 *   put:
 *     tags:
 *       - Pro-players
 *     summary: Update pro-player
 *     description: Returns updated pro-player.
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
 *             $ref: '#/components/schemas/ProPlayerInput'
 *     responses:
 *       200:
 *         description: Pro player updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProPlayer'
 *       404:
 *         description: If no pro-player found by user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No pro-player found by user_id"
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hourly rate is required"
 */
router.put('/:id', 
    validator.validateId(),
    validator.requireAuth,
    validator.requireOwner(),
    validator.requireRoles('ProPlayer'),
    validator.requireFields('hourly_rate'),
    validator.validatePositiveNumber('hourly_rate'),
    proPlayerController.updateProPlayer
);

/**
 * @openapi
 * /pro-players/{id}:
 *   delete:
 *     tags:
 *       - Pro-players
 *     summary: Delete pro-player
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pro-player deleted
 *       404:
 *         description: If no pro-player found by user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example: 
 *                 error: 
 *                   "No pro-player found by user_id"
 *       400:
 *         description: Cannot delete due to associated ads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete pro-player with associated ads"
 */
router.delete('/:id', 
    validator.validateId(),
    validator.requireAuth,
    validator.requireOwner(),
    validator.requireRoles('ProPlayer'),
    proPlayerController.deleteProPlayer
);

/**
 * @openapi
 * /pro-players/{id}/games:
 *   get:
 *     tags:
 *       - Pro-players
 *     summary: Get games for certain pro-player
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user_id of the pro-player
 *     responses:
 *       200:
 *         description: List of games for certain pro-player
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       404:
 *         description: If no games found by that pro-player user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No games found by pro-player user_id"
 */
router.get('/:id/games', 
    validator.validateId(),
    validator.requireAuth,
    proPlayerController.getGamesForProPlayer
);

/**
 * @openapi
 * /pro-players/{id}/games:
 *   post:
 *     tags:
 *       - Pro-players
 *     summary: Assign game to pro-player
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user_id of the pro-player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_id:
 *                 type: integer
 *               current_rank:
 *                 type: string
 *               years_experience:
 *                 type: integer
 *             required:
 *               - game_id
 *     responses:
 *       201:
 *         description: Game assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProPlayerGame'
 *       400:
 *         description: Invalid input or game already assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Game already assigned"
 *       404:
 *         description: Pro player or game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pro player n ot found"
 */
router.post('/:id/games', 
    validator.validateId([
        { source: 'body', field: 'game_id' },
        { source: 'params', field: 'id' }
    ]),
    validator.checkIfExists([
        {model: Game, source: 'body', field: 'game_id'}
    ]),
    validator.requireAuth,
    validator.requireOwner(),
    validator.requireRoles('ProPlayer'),
    validator.requireFields('years_experience', 'current_rank'),
    validator.validatePositiveNumber('years_experience'),
    proPlayerController.AssignGameToProPlayer
);

/**
 * @openapi
 * /pro-players/{id}/games/{game_id}:
 *   patch:
 *     tags:
 *       - Pro-players
 *     summary: Update pro player game details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: user_id of the pro player
 *       - in: path
 *         name: game_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               current_rank:
 *                 type: string
 *               years_experience:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pro player game details updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProPlayerGame'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Invalid input"
 *       404:
 *         description: Pro player game association not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Pro player game association not found"
 */

router.patch('/:id/games/:game_id', 
    validator.validateId([
        { source: 'params', field: 'game_id' },
        { source: 'params', field: 'id' }
    ]),
    validator.checkIfExists([
        {model: Game, source: 'params', field: 'game_id'}
    ]),
    validator.requireAuth,
    validator.requireOwner(),
    validator.requireRoles('ProPlayer'),
    validator.validatePositiveNumber('years_experience'),
    proPlayerController.UpdateProPlayerGameDetails
);

export default router;