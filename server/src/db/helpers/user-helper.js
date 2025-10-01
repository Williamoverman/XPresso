import { User, Role } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

async function getAll() {
    return await generic.findAll(User, {}, { exclude: ['password'] });
}

async function getById(id) {
    return await generic.findById(User, id, {}, { exclude: ['password'] })
}

async function create(data) {
    return await generic.createRecord(User, data, { exclude: ['password'] })
}

async function update(id, data) {
    return await generic.updateRecord(User, id, data, { exclude: ['password'] })
}

async function remove(id) {
    await generic.deleteRecord(User, id)

    return;
}

async function getRolesById(id) {
    const user = await generic.findById(User, id, { include: Role })

    if (user.Roles.length === 0) {
        const error = new Error(`User has no roles`);
        error.status = StatusCodes.NO_CONTENT;
        throw error;
    }

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
    const user = await generic.findById(User, id);

    if (user.is_active === active) {
        const error = new Error(`User is already ${active ? "activated" : "deactivated"}`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    user.is_active = active;
    await user.save();

    return user;
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    getRolesById,
    addRole,
    toggleActive
}