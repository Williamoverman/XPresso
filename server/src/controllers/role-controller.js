import { StatusCodes } from 'http-status-codes';
import roleQueries from "../db/helpers/role-helper.js";

const getAllRoles = async (req, res, next) => {
    try {
        const roles = await roleQueries.getAll();
        res.status(StatusCodes.OK).json(roles);
    } catch (error) {
        next(error);
    }
}

const getRoleById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const role = await roleQueries.getById(id);
        res.status(StatusCodes.OK).json(role);
    } catch (error) {
        next(error);
    }
}

const createRole = async (req, res, next) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            const error = new Error('Name is required');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
        
        const input = {
            name: name
        }

        const createdRole = await roleQueries.create(input);
        res.status(StatusCodes.CREATED).json(createdRole);
    } catch (error) {
        next(error);
    }
}

const updateRole = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            const error = new Error('Name is required');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
        
        const input = {
            name: name
        }

        const updatedRole = await roleQueries.update(input, id);
        res.status(StatusCodes.OK).json(updatedRole);
    } catch (error) {
        next(error);
    }
}

const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;

        await roleQueries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

const getUsersWithRole = async (req, res, next) => {
    try {
        const { id } = req.params;

        const usersWithRoles = await roleQueries.getUsers(id);
        res.status(StatusCodes.OK).json(usersWithRoles);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    getUsersWithRole
}