import { StatusCodes } from 'http-status-codes';
import userQueries from "../db/helpers/user-helper.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userQueries.getAll();
        res.status(StatusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userQueries.getById(id);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
}

const createUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password) {
            const error = new Error('Email and/or password are required');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const input = {
            email: email,
            password: hashedPassword,
            username: username
        }

        const newUser = await userQueries.create(input);
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { email, password, username } = req.body;

        let input = {};

        if (email) input.email = email;
        if (username) input.username = username;
        if (password) input.password = await bcrypt.hash(password, 10);
        
        const updatedUser = await userQueries.update(id, input);
        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await userQueries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

const getUserRolesById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const roles = await userQueries.getRolesById(id);
        res.status(StatusCodes.OK).json(roles);
    } catch (error) {
        next(error);
    }
}

const addRoleToUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role_id } = req.body;

        const userRole = await userQueries.addRole(id, role_id);
        res.status(StatusCodes.CREATED).json(userRole);
    } catch (error) {
        next(error);
    }
}

const activateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await userQueries.toggleActive(id, true);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
}

const deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await userQueries.toggleActive(id, false);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
}

const getUserReservations = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reservations = await userQueries.getReservations(id);
        res.status(StatusCodes.OK).json(reservations);
    } catch (error) {
        next(error);
    }
}

const getUserReviews = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reviews = await userQueries.getReviews(id);
        res.status(StatusCodes.OK).json(reviews);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserRolesById,
    addRoleToUser,
    activateUser,
    deactivateUser,
    getUserReservations,
    getUserReviews
}