import { User } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"

async function getAll() {
    return await generic.findAll(User, {}, { attributes: { exclude: ['password'] } });
}

async function getById(id) {
    return await generic.findById(User, id, { attributes: { exclude: ['password'] } })
}

async function create(data) {
    return await generic.createRecord(User, data, { attributes: { exclude: ['password'] } })
}

async function update(id, data) {
    return await generic.updateRecord(User, id, data, { attributes: { exclude: ['password'] } })
}

async function remove(id) {
    return await generic.deleteRecord(User, id)
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
}