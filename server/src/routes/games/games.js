import express from 'express';
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
router.get('/', (req, res) => {
    
});

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
router.get('/:id', (req, res) => {
    
});

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
 *                   example: "Name and or abbrevations are required"
 */
router.post('/', (req, res) => {
    
});

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
 *                   example: "Name and or abbrevations are required"
 */
router.put('/:id', (req, res) => {
    
});

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
router.delete('/:id', (req, res) => {
    
});

/**
 * @openapi
 * /games/{id}/ads:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get ads for certain game
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the game
 *     responses:
 *       200:
 *         description: List of ads for certain game
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ad'
 *       404:
 *         description: If no ads found by that game ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No ads found by game ID"
 */
router.get('/:id/ads', (req, res) => {
    
});

export default router;