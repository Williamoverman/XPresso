import { StatusCodes } from 'http-status-codes';
import queries from "../db/helpers/user-helper.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res, next) => {
    try {
        const users = await queries.getAll();
        res.status(StatusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await queries.getById(id);
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

        const newUser = await queries.create(input);
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { email, password, username } = req.body;

        const input = {};

        if (email) input.email = email;
        if (username) input.username = username;
        if (password) input.password = await bcrypt.hash(password, 10);
        
        const updatedUser = await queries.update(id, input);
        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await queries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

const getUserRolesById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const roles = await queries.getRolesById(id);
        res.status(StatusCodes.OK).json(roles);
    } catch (error) {
        next(error);
    }
}

const addRoleToUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role_id } = req.body;

        const userRole = await queries.addRole(id, role_id);
        res.status(StatusCodes.CREATED).json(userRole);
    } catch (error) {
        next(error);
    }
}

const activateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await queries.toggleActive(id, true);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
}

const deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await queries.toggleActive(id, false);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
}

const getUserReservations = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reservations = await queries.getReservations(id);
        res.status(StatusCodes.OK).json(reservations);
    } catch (error) {
        next(error);
    }
}

const getUserReviews = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reviews = await queries.getReviews(id);
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