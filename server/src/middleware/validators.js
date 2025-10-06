import { StatusCodes } from "http-status-codes";
import { User, Role } from "../db/database-helper.js";
import validator from 'validator';
import jwt from "jsonwebtoken";

/**
 * Generic ID validator
 * @param {string} source - body, params or query
 * @param {string} field - The field name
 */
function validateId(source = 'params', field = 'id') {
    return (req, res, next) => {
        const value = req[source]?.[field];

        if (!value || isNaN(value)) {
            const error = new Error(`Invalid ${field}`);
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
        }
        
        next();
    };
}

/**
 * Validator for email
 */
function validateEmail(req, res, next) {    
    const { email } = req.body;
    if (!email) return next();

    if (!validator.isEmail(email)) {
        const error = new Error('Invalid email format');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    next();
}

/**
 * Validator for password
 */
function validatePassword(req, res, next) {
    const { password } = req.body;
    if (!password)
        return next();

    if (validator.isStrongPassword(password)) {
        const error = new Error('Password is not strong enough');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    next();
}

/**
 * Validator for date formats
 */
function validateDates(req, res, next) {
    const { start_date, end_date } = req.body;

    if (!start_date && !end_date) return next();

    if ((start_date && !validator.isDate(start_date)) || 
        (end_date && !validator.isDate(end_date))) {
        const error = new Error('Invalid date format');
        error.status = StatusCodes.BAD_REQUEST;
        return next(error);
    }

    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
        const error = new Error('Start date must be before end date');
        error.status = StatusCodes.BAD_REQUEST;
        return next(error);
    }

    next();
}

/**
 * Validator for positive numbers
 * @param {string} field - The field name
 */
function validatePositiveNumber(field) {
    return (req, res, next) => {
        const value = req.body[field];
        if (value === undefined || value === null) return next();

        if (isNaN(value) || value < 0) {
            const error = new Error(`${field} must be a positive number`);
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
        }

        next();
    };
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
    const targetUserId = parseInt(req.params.id);

    if (req.user.id !== targetUserId) {
        const error = new Error('Forbidden: not authorized to edit this user');
        error.status = StatusCodes.FORBIDDEN;
        throw error;
    }
    next();
}

/**
 * Validator for required fields
 * @param  {...string} fields
 * @returns
 */
function requireFields(...fields) {
    return (req, res, next) => {
        const missing = fields.filter(field => !req.body[field]);
        
        if (missing.length > 0) {
            const error = new Error(`Missing required fields: ${missing.join(', ')}`);
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
        }
        
        next();
    };
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
    requireOwner,
    requireFields
};