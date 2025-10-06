import { StatusCodes } from "http-status-codes";
import { User, Role } from "../db/database-helper.js";
import jwt from "jsonwebtoken";

/**
 * Validator to check if ID is valid
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
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

/**
 * Validator for password checks if length is smaller then 8
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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

/**
 * Validator for checking dates
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validateDates(req, res, next) {
    const { start_date, end_date } = req.body;

    if (!start_date && !end_date)
        return next();

    return next();
}

/**
 * Validator for years of experience checks if it is a positive number
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function validateYearsExperience(req, res, next) {
    const { years_experience } = req.body;
    if (!years_experience)
        return next();

    if (years_experience < 0) {
        const error = new Error('Years of experience has to be more than 0');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    next();
}

/**
 * Validator to check if email exists
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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

/**
 * Validator to check if role exists
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
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

/**
 * Validator to check if user is logged in with a valid JWT
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        console.log(req.headers);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Unauthorized: missing or invalid token');
            error.status = StatusCodes.UNAUTHORIZED;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        const error = new Error('Unauthorized: invalid or expired token');
        error.status = StatusCodes.UNAUTHORIZED;
        next(error);
    }
}

/**
 * Function to check if user has one of or more than one of specific roles
 * @param  {...any} requiredRoles 
 * @returns 
 */
function requireRoles(...requiredRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        const error = new Error('Unauthorized: user not authenticated');
        error.status = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      console.log(req.user.roles)
      const userRoles = req.user.roles || [];
      const hasAccess = requiredRoles.some(role => userRoles.includes(role));

      if (!hasAccess) {
        const error = new Error(`Forbidden: requires one of [${requiredRoles.join(', ')}]`);
        error.status = StatusCodes.FORBIDDEN;
        throw error;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Validator to check if the person sending the request is the owner of the values hes editing
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function requireOwner(req, res, next) {
    let id = req.body.user_id ? req.body.user_id : req.params.id;
    if (req.user.id !== parseInt(id)) {
        const error = new Error('Forbidden: not authorized to edit this user');
        error.status = StatusCodes.FORBIDDEN;
        throw error;
    }
    next();
}

export default {
    validateId,
    validateEmail,
    validatePassword,
    validateYearsExperience,
    validateDates,
    checkIfEmailExists,
    checkIfRoleExists,
    requireAuth,
    requireRoles,
    requireOwner
};