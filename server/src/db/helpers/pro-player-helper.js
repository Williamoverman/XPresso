import { Ad, Game, ProPlayer, ProPlayerGame, Review, User, Role } from "../database-helper.js";
import generic from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

async function getAll() {
    return await generic.findAll(ProPlayer);
}

async function getById(id) {
    return await generic.findById(ProPlayer, id);
}

async function create(id) {
    const user = await generic.findById(User, id, { include: ProPlayer }); //check for user first (if exists) include proplayer to check if he/she is already a proplayer
    if (user.ProPlayer) {
        const error = new Error('This user is already registered as a pro player');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    const proPlayer = await generic.createRecord(ProPlayer, { id: id });

    const proPlayerRole = await Role.findOne({ where: { name: 'ProPlayer' } });
    if (proPlayerRole) await user.addRole(proPlayerRole);

    return proPlayer;
}

async function update(id, data) {
    return await generic.updateRecord(ProPlayer, id, data);
}

async function remove(id) {
    const proPlayer = await generic.findById(ProPlayer, id, { include: Ad })

    if (proPlayer.Ads.length > 0) {
        const error = new Error('Cannot delete pro player with associated relations');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    await generic.deleteRecord(ProPlayer, id);
    return;
}

async function getGames(id) {
    const proPlayer = await generic.findById(ProPlayer, id, { include: {
            model: Game,
            through: { attributes: [] }
        }});

    return proPlayer.Games;
}

async function assignGame(id, data) {
    const proPlayer = await generic.findById(ProPlayer, id, { include: Game });
    if (proPlayer.Games.some(game => game.id === data.game_id)) {
        const error = new Error('This game is already assigned to this pro player');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    return await proPlayer.addGame(data.game_id, {
        through: {
            current_rank: data.current_rank,
            years_experience: data.years_experience
        }
    });
}

async function updateAssignedGame(id, game_id, data) {
    const proPlayer = await generic.findById(ProPlayer, id, { include: Game });
    if (!proPlayer.Games.some(game => game.id == game_id)) {
        const error = new Error('This game is not assigned to this pro player');
        error.status = StatusCodes.NOT_FOUND;
        throw error;
    }
    
    await ProPlayerGame.update(data,
        {
            where: {
                pro_player_id: id,
                game_id: game_id
            }
        }
    );

    return await ProPlayerGame.findOne({ where: { pro_player_id: id, game_id: game_id } });
}

async function getReviews(id) {
    const proPlayer = await generic.findById(ProPlayer, id, { include: Review });

    return proPlayer.Reviews;
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    getGames,
    assignGame,
    updateAssignedGame,
    getReviews
}