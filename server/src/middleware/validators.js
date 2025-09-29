import { StatusCodes } from "http-status-codes";

function validateId(req, res, next) {
    const { id } = req.params;

    if (!id || isNaN(id)){
        const error = new Error('Invalid ID');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }
    
    next();
}

async function validateEmail(req, res, next) {    
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

export default {
    validateId,
    validateEmail,
    validatePassword
};