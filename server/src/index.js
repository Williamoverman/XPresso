import express from 'express';
import cors from 'cors';
import swaggerUi, { serve } from 'swagger-ui-express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { swaggerSpec } from './swagger-config.js';
import { initWebSocket } from './websocket.js';
import usersRouter from './routes/users.js';
import gamesRouter from './routes/games.js';
import rolesRouter from './routes/roles.js';
import proPlayersRouter from './routes/pro-players.js';
import adsRouter from './routes/ads.js';
import reviewsRouter from './routes/reviews.js';
import reservationsRouter from './routes/reservations.js';
import authRouter from './routes/auth.js';
import validator from './middleware/validators.js';
import sanitizeHtml from 'sanitize-html';
import { seed } from './db/seedUsersOnly.js';

// Check if NODE_ENV environment variable is set, otherwise go to development mode
const nodeEnv = process.env.NODE_ENV || 'dev';
const app = express();
const port = 3000;

const server = createServer(app);

// create WebSocket server
const wss = new WebSocketServer({ server });
initWebSocket(wss);
wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const sanitizedData = sanitizeHtml(data.toString(), {
            allowedTags: [],
            allowedAttributes: {}
        });
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(sanitizedData);
            }
        });
    });
});

// Set up basic JSON parsing and CORS headers
app.use(express.json({ type: 'application/json' }));
app.use(cors({
    origin: ['http://localhost:4173', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeHtml(req.body[key], {
                    allowedTags: [],
                    allowedAttributes: {}
                });
            }
        }
    }
    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeHtml(req.query[key], {
                    allowedTags: [],
                    allowedAttributes: {}
                });
            }
        }
    }
    next();
});

// Setup swagger and make it available on /api-docs.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', usersRouter);
app.use('/games', gamesRouter);
app.use('/roles', validator.requireAuth, validator.requireRoles('Admin'), rolesRouter);
app.use('/pro-players', proPlayersRouter);
app.use('/ads', adsRouter);
app.use('/reviews', reviewsRouter);
app.use('/reservations', validator.requireAuth, reservationsRouter);
app.use('/auth', authRouter);

// Global error handler. In your code, throw an object with a status and message, and it will be caught here. We ignore one eslint call here, because next is needed.
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    res
        .status(err.status || 500)
        .json({
            message: err.message || 'Something went wrong!'
        });
});

// als omgeving prod is seed alleen de nodige gebruikers
if (process.env.NODE_ENV === 'prod')
    await seed();

// Setup server, by default on port 3000
if (process.env.NODE_ENV !== 'test') {
    server.listen(port, () => {
        console.log(`App listening on port ${port}, running in ${nodeEnv} mode.`);
    });
}

// Export app for testing purposes
export default app;