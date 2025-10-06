import { Ad, Reservation } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

async function getAll(options) {
    let whereClause = [];
    if (options.service_type) whereClause.push({ service_type: options.service_type });
    if (options.game_id) whereClause.push({ game_id: options.game_id });
    if (options.pro_player_id) whereClause.push({ pro_player_id: options.pro_player_id });

    const where = whereClause.length > 0 ? { [Op.or]: whereClause } : {};

    return await generic.findAll(Ad, { where: where } );
}

async function getById(id) {
    return await generic.findById(Ad, id);
}

async function create(data) {
    return await generic.createRecord(Ad, data);
}

async function update(data, id) {
    return await generic.updateRecord(Ad, id, data);
}

async function remove(id) {
    const ad = await generic.findById(Ad, id, { include: Reservation });
    
    if (ad.Reservations.length > 0) {
        const error = new Error('Cannot delete ad with associated reservations');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    await generic.deleteRecord(Ad, id);
    return;
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
}