import { StatusCodes } from "http-status-codes";
import { User } from "../db/database-helper.js";
import validator from 'validator';
import jwt from "jsonwebtoken";
import createService from "../db/helpers/generic-helper.js";

/**
 * Generic ID validator
 * @param {Array<{source: string, field: string}>} validators - Array of {source, field} objects to validate, if left empty checks for basic params, id
 */
function validateId(validators = [{source: 'params', field: 'id'}]) {
    return (req, res, next) => {
        for (const {source, field} of validators) {
            const value = req[source]?.[field];
            if (!value || isNaN(value)) {
                const error = new Error(`Invalid ${field}`);
                error.status = StatusCodes.BAD_REQUEST;
                return next(error);
            }
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
 * @param {...string} fields - The array of field names
 */
function validatePositiveNumber(...fields) {
    return (req, res, next) => {
        const negative = fields.filter(field => req.body[field] < 0);
        if (negative.length > 0) {
            const error = new Error(`These fields cannot have a negative number: ${negative.join(', ')}`);
            error.status = StatusCodes.BAD_REQUEST;
            return next(error);
        }
        
        next();
    };
}

/**
 * Validator to check if email exists (slightly differs from generic existt check)
 */
async function checkIfEmailExists(req, res, next) {
    const { email } = req.body;
    const { id } = req.params;
    if (!email) return next();

    const user = await User.findOne({ where: { email } });

    if (user && user.id !== parseInt(id)) {
        const error = new Error(`Email already exists`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    next();
}

/**
 * Generic existence validator
 * @param {Array<{model: Object, source: string, field: string}>} validators - Array of validator objects
 */
function checkIfExists(validators = []) {
    return async (req, res, next) => {
        for (const {model, source, field} of validators) {
            const value = req[source]?.[field];

            const service = createService(model);
            await service.findById(parseInt(value));
        }
        next();
    };
}

/**
 * Validator to check if user is logged in with a valid JWT
 */
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

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
 * @param  {...any} requiredRoles Role to check for, if left empty you just need any role
 * @returns middleware function
 */
function requireRoles(...requiredRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        const error = new Error('Unauthorized: user not authenticated');
        error.status = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      if (requiredRoles.length === 0) {
        next();
        return;
      }

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
 * Generic owner validator
 * @param {string} source - body, params or query
 * @param {string} field - The field name for target user ID, defaults to params/id
 */
function requireOwner(source = 'params', field = 'id') {
    return (req, res, next) => {
        if (req.user.id !== parseInt(req[source]?.[field])) {
            const error = new Error('Forbidden: not authorized to edit this user');
            error.status = StatusCodes.FORBIDDEN;
            throw error;
        }

        next();
    };
}

/**
 * Generic resource ownership validator
 * @param {Object} model - Sequelize model
 * @param {string} ownerField - Field name that contains the user ID
 * @returns middleware function
 */
function requireResourceOwner(model, ownerField = 'user_id') {
    return async (req, res, next) => {
        try {
            const service = createService(model);
            const record = await service.findById(parseInt(req.params.id));

            if (record[ownerField] !== req.user.id) {
                const error = new Error(`Forbidden: not authorized to modify this ${model.name}`);
                error.status = StatusCodes.FORBIDDEN;
                return next(error);
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}

/**
 * Validator for required fields
 * @param  {...string} fields
 * @returns middleware function
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
    validatePositiveNumber,
    validateDates,
    checkIfEmailExists,
    checkIfExists,
    requireAuth,
    requireRoles,
    requireOwner,
    requireResourceOwner,
    requireFields
};