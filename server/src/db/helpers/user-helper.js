import { User, Role, Reservation, Review } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

async function getAll() {
    return await generic.findAll(User, {}, { exclude: ['password'] });
}

async function getById(id) {
    return await generic.findById(User, id, {}, { exclude: ['password'] })
}

async function create(data) {
    const user = await generic.createRecord(User, data, { exclude: ['password'] });

    const userRole = await Role.findOne({ where: { name: 'User' } });
    if (userRole) await user.addRole(userRole);

    return user;
}

async function update(id, data) {
    return await generic.updateRecord(User, id, data, { exclude: ['password'] })
}

async function remove(id) {
    const user = await generic.findById(User, id, { include: [ Reservation ] })

    if (user.Reservations.length > 0) {
        const error = new Error('Cannot delete user with associated relations');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    await generic.deleteRecord(User, id)
    return;
}

async function getRolesById(id) {
    const user = await generic.findById(User, id, { include: Role })

    return user.Roles;
}

async function addRole(id, role_id) {
    const user = await generic.findById(User, id, { include: Role });

    if (await user.hasRole(role_id)) {
        const error = new Error(`User already has role assigned`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    return await user.addRole(role_id);
}

async function toggleActive(id, active) {
    const user = await generic.findById(User, id, {}, { exclude: ['password'] });

    if (user.is_active === active) {
        const error = new Error(`User is already ${active ? "activated" : "deactivated"}`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    user.is_active = active;
    await user.save();

    return user;
}

async function getReservations(id) {
    const userReservations = await generic.findById(User, id, { include: Reservation });

    return userReservations.Reservations;
}

async function getReviews(id) {
    const userReviews = await generic.findById(User, id, { include: Review });

    return userReviews.Reviews;
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    getRolesById,
    addRole,
    toggleActive,
    getReservations,
    getReviews
}