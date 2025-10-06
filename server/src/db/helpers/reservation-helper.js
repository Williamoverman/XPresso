import { Reservation } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

async function getAll(ad_id) {
    const where = ad_id ? { where: { ad_id: ad_id } } : {};
    return await generic.findAll(Reservation, where );
}

async function getById(id) {
    return await generic.findById(Reservation, id);
}

async function create(data) {
    return await generic.createRecord(Reservation, data);
}

async function update(data, id) {
    return await generic.updateRecord(Reservation, id, data);
}

async function remove(id) {
    await generic.deleteRecord(Reservation, id);
    return;
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
}