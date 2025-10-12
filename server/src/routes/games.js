import express from 'express';
import gameController from '../controllers/game-controller.js';
import validator from '../middleware/validators.js';

const router = express.Router();

/**
 * @openapi
 * /games:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get all games
 *     description: Returns all games.
 *     responses:
 *       200:
 *         description: Games returned succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router.get('/', 
    gameController.getAllGames
);

/**
 * @openapi
 * /games/{id}:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get game by ID
 *     description: Returns a game by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the game
 *     responses:
 *       200:
 *         description: Game returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: If no game found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No game found by ID"
 */
router.get('/:id', 
    validator.validateId(),
    gameController.getGameById
);

/**
 * @openapi
 * /games:
 *   post:
 *     tags:
 *       - Games
 *     summary: Create game
 *     description: Returns created game.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       201:
 *         description: Game created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
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
    validator.requireAuth,
    validator.requireRoles(),
    validator.requireFields('name', 'abbreviation'),
    gameController.createGame
);

/**
 * @openapi
 * /games/{id}:
 *   put:
 *     tags:
 *       - Games
 *     summary: Update game
 *     description: Returns updated game.
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
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: Game updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: If no game found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No game found by ID"
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
router.put('/:id', 
    validator.validateId(),
    validator.requireAuth,
    validator.requireRoles(),
    validator.requireFields('name', 'abbreviation'),
    gameController.updateGame
);

/**
 * @openapi
 * /games/{id}:
 *   delete:
 *     tags:
 *       - Games
 *     summary: Delete game
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Game deleted
 *       404:
 *         description: If no game found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example: 
 *                 error: 
 *                   "No game found by ID"
 *       400:
 *         description: Cannot delete due to associated ads/pro-players
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete game with associated ads/pro-players"
 */
router.delete('/:id', 
    validator.validateId(),
    validator.requireAuth,
    validator.requireRoles(),
    gameController.deleteGame
);

export default router;