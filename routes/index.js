const express = require('express');
const router = express.Router();
const AuthControllers = require('../controllers/authControllers');
const jwtAuth = require('../middleware/jwtAuth');

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Render register page
 *     tags: 
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully renders the register page
 */
router.get('/register', AuthControllers.renderRegisterPage);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 */
router.post('/register', AuthControllers.handleRegister);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Render login page
 *     tags: 
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully renders the login page
 */
router.get('/login', AuthControllers.renderLoginPage);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', AuthControllers.handleLogin);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Render dashboard page
 *     tags: 
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successfully renders the dashboard page
 */
router.get('/dashboard', AuthControllers.renderDashboardPage);

/**
 * @swagger
 * /auth/authenticate:
 *   get:
 *     summary: Authenticate a user with JWT
 *     tags: 
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */
router.get('/auth/authenticate', jwtAuth, AuthControllers.authenticate);

module.exports = router;
