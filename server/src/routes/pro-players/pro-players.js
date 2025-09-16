import express from 'express';
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
router.get('/', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}:
 *   get:
 *     tags:
 *       - Pro-players
 *     summary: Get pro-player by user_id
 *     description: Returns a pro-player by user_id.
 *     parameters:
 *       - in: path
 *         name: user_id
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
router.get('/:user_id', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players:
 *   post:
 *     tags:
 *       - Pro-players
 *     summary: Create pro-player
 *     description: Returns created pro-player.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *             required:
 *               - user_id
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
 *                   example: "Pro player already exists for this user"
 */
router.post('/', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}:
 *   put:
 *     tags:
 *       - Pro-players
 *     summary: Update pro-player
 *     description: Returns updated pro-player.
 *     parameters:
 *       - in: path
 *         name: user_id
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
 *         description: Game updated
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
router.put('/:user_id', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}:
 *   delete:
 *     tags:
 *       - Pro-players
 *     summary: Delete pro-player
 *     parameters:
 *       - in: path
 *         name: user_id
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
router.delete('/:user_id', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}/ads:
 *   get:
 *     tags:
 *       - Pro-players
 *     summary: Get ads for certain pro-player
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user_id of the pro-player
 *     responses:
 *       200:
 *         description: List of ads for certain pro-player
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ad'
 *       404:
 *         description: If no ads found by that pro-player user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No ads found by pro-player user_id"
 */
router.get('/:user_id/ads', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}/games:
 *   get:
 *     tags:
 *       - Pro-players
 *     summary: Get games for certain pro-player
 *     parameters:
 *       - in: path
 *         name: user_id
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
router.get('/:user_id/games', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}/games:
 *   post:
 *     tags:
 *       - Pro-players
 *     summary: Assign game to pro-player
 *     parameters:
 *       - in: path
 *         name: user_id
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
router.post('/:user_id/games', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}/games/{game_id}:
 *   put:
 *     tags:
 *       - Pro-players
 *     summary: Update pro player game details
 *     parameters:
 *       - in: path
 *         name: user_id
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

router.put('/:user_id/games/:game_id', (req, res) => {
    
});

/**
 * @openapi
 * /pro-players/{user_id}/reviews:
 *   get:
 *     tags:
 *       - Pro-players
 *     summary: Get pro player reviews
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews for pro player
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Pro player not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Pro player not found"
 */
router.put('/:user_id/reviews', (req, res) => {
    
});

export default router;