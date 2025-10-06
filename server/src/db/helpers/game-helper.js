import { Ad, Game, ProPlayer } from "../database-helper.js";
import createService from "../helpers/generic-helper.js";
import { StatusCodes } from "http-status-codes";

const gameService = createService(Game, {
    beforeDelete: async (game) => {
        await game.reload({ include: [ProPlayer, Ad] });
        
        if (game.ProPlayers.length > 0 || game.Ads.length > 0) {
            const error = new Error('Cannot delete game with associated relations');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
    }
});

export default {
    getAll: gameService.findAll.bind(gameService),
    getById: gameService.findById.bind(gameService),
    create: gameService.create.bind(gameService),
    update: gameService.update.bind(gameService),
    remove: gameService.delete.bind(gameService)
};