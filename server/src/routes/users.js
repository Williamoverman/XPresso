import express from 'express';
import userController from '../controllers/user-controller.js';
import validator from '../middleware/validators.js';

const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Returns all users.
 *     responses:
 *       200:
 *         description: Users returned succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', 
    userController.getAllUsers
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Returns a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found by ID"
 */
router.get('/:id', 
    validator.validateId, 
    userController.getUserById
);

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user
 *     description: Returns created user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email format"
 */
router.post('/', 
    validator.validateEmail, 
    validator.checkIfEmailExists, 
    validator.validatePassword, 
    userController.createUser
);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user
 * 
 *     description: Returns updated user.
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
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found by ID"
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email format"
 */
router.patch('/:id', 
    validator.validateId, 
    validator.requireAuth,
    validator.requireOwner,
    validator.validateEmail, 
    validator.checkIfEmailExists, 
    validator.validatePassword, 
    userController.updateUser
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example: 
 *                 error: 
 *                   "No user found by ID"
 *       400:
 *         description: Cannot delete due to associated relations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete user with associated relations"
 */
router.delete('/:id', 
    validator.validateId,
    validator.requireAuth,
    validator.requireOwner,
    userController.deleteUser
);

/**
 * @openapi
 * /users/{id}/roles:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users roles by user ID
 *     description: Returns a users roles by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of roles for user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found by ID"
 */
router.get('/:id/roles',
    validator.validateId,
    validator.requireAuth,
    validator.requireRoles('Admin'),
    userController.getUserRolesById
);

/**
 * @openapi
 * /users/{id}/roles:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add role to user
 *     description: Returns created user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to give the role to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_id:
 *                 type: integer
 *             required:
 *               - role_id
 *     responses:
 *       201:
 *         description: Role assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example:  "No user found by ID"
 *       400:
 *         description: Invalid input or role already assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Role already assigned"
 */
router.post('/:id/roles', 
    validator.validateId,
    validator.requireAuth,
    validator.requireRoles('Admin'),
    userController.addRoleToUser
);

/**
 * @openapi
 * /users/{id}/activate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Activate user
 *     description: Activates a user account by ID, restricted to admin users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to activate
 *     responses:
 *       200:
 *         description: User activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User is already active"
 *       401:
 *         description: Unauthorized, admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Admin access required"
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found by ID"
 */
router.patch('/:id/activate',
    validator.validateId,
    validator.requireAuth,
    validator.requireRoles('Admin'),
    userController.activateUser
);

/**
 * @openapi
 * /users/{id}/deactivate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Deactivate user
 *     description: Deactivates a user account by ID, restricted to admin users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to deactivate
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User is already deactivated"
 *       401:
 *         description: Unauthorized, admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Admin access required"
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found by ID"
 */
router.patch('/:id/deactivate', 
    validator.validateId,
    validator.requireAuth,
    validator.requireRoles('Admin'),
    userController.deactivateUser
);

/**
 * @openapi
 * /users/{id}/reservations:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reservations for user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found by ID"
 */
router.get('/:id/reservations', 
    validator.validateId,
    validator.requireAuth,
    userController.getUserReservations
);

/**
 * @openapi
 * /users/{id}/reviews:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews by user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: If no user found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found by ID"
 */
router.get('/:id/reviews', 
    validator.validateId,
    userController.getUserReviews
);

export default router;