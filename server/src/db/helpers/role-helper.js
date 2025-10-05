import { Role, User } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

async function getAll() {
    return await generic.findAll(Role);
}

async function getById(id) {
    return await generic.findById(Role, id);
}

async function create(data) {
    return await generic.createRecord(Role, data);
}

async function update(data, id) {
    return await generic.updateRecord(Role, id, data);
}

async function remove(id) {
    const role = await generic.findById(Role, id, { include: User });

    if (role.Users.length > 0) {
        const error = new Error('Cannot delete role with associated users');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    await generic.deleteRecord(Role, id);
    return;
}

async function getUsers(id) {
    const role = await generic.findById(Role, id, { include: {
            model: User,
            attributes: { exclude: ['password'] },
            through: { attributes: [] }
        }});

    return role.Users;
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    getUsers
}