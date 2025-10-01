import { StatusCodes } from "http-status-codes";
import { User, Role } from "../db/database-helper.js";
import jwt from "jsonwebtoken";

function validateId(req, res, next) {
    const { id } = req.params;

    if (!id || isNaN(id)){
        const error = new Error('Invalid ID');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }
    
    next();
}

function validateEmail(req, res, next) {    
    const { email } = req.body;
    if (!email)
        return next();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        const error = new Error('Invalid email format');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    next();
}

function validatePassword(req, res, next) {
    const { password } = req.body;
    if (!password)
        return next();

    if (password.length < 8) {
        const error = new Error('Password must be atleast 8 characters');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    next();
}

async function checkIfEmailExists(req, res, next) {
    const { email } = req.body;
    const { id } = req.params;
    if (!email)
        return next();

    const user = await User.findOne({ where: { email } });

    if (user && user.id !== parseInt(id)) {
        const error = new Error(`Email already exists`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    next();
}

async function checkIfRoleExists(req, res, next) {
    const { role_id } = req.body;
    
    if (!role_id || isNaN(role_id)) {
        const error = new Error(`Invalid role ID`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    const role = await Role.findByPk(role_id);
    if (!role) {
        const error = new Error(`Role does not exist`);
        error.status = StatusCodes.NOT_FOUND;
        throw error;
    }

    next();
}

function requireAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        const error = new Error('Unauthorized, admin acces required');
        error.status = 401;
        throw error;
    }

    try {
        req.user = decoded.user;
        next();
    } catch (err) {
        const error = new Error('Unauthorized, admin acces required');
        error.status = 401;
        throw error;
    }
}

export default {
    validateId,
    validateEmail,
    validatePassword,
    checkIfEmailExists,
    checkIfRoleExists,
    requireAdmin
};