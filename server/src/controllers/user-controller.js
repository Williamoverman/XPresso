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

const getUserRolesById = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

const addRoleToUser = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

const deactivateUser = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

const activateUser = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

const getUserReservations = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

const getUserReviews = (req, res, next) => {
    try {

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
    deactivateUser,
    activateUser,
    getUserReservations,
    getUserReviews
}