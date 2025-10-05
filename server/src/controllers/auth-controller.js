import { StatusCodes } from 'http-status-codes';
import authQueries from '../db/helpers/auth-helper.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const user = await authQueries.getByEmail(email);

        if (!user || !await bcrypt.compare(password, user.password)) {
            const error = new Error('Invalid email or password');
            error.status = StatusCodes.UNAUTHORIZED;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, roles: user.Roles.map(r => r.name) },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(StatusCodes.OK).json({ token });
    } catch (error) {
        next(error);
    }
}

const logout = (req, res, next) => {
    try {
        res.status(StatusCodes.OK).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}

export default {
    login,
    logout
}