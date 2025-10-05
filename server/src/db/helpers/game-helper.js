import { Ad, Game, ProPlayer } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

async function getAll() {
    return await generic.findAll(Game);
}

async function getById(id) {
    return await generic.findById(Game, id);
}

async function create(data) {
    return await generic.createRecord(Game, data);
}

async function update(data, id) {
    return await generic.updateRecord(Game, id, data);
}

async function remove(id) {
    const game = await generic.findById(Game, id, { include: [ ProPlayer, Ad ] });
    
    if (game.ProPlayers.length > 0 || game.Ads.length > 0) {
        const error = new Error('Cannot delete game with associated relations');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    await generic.deleteRecord(Game, id);
    return;
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
}