import { Ad, Game, ProPlayer, ProPlayerGame, Review, User, Role } from "../database-helper.js";
import createService from "../helpers/generic-helper.js";
import { StatusCodes } from "http-status-codes";

const proPlayerService = createService(ProPlayer, {
    beforeDelete: async (proPlayer) => {
        await proPlayer.reload({ include: Ad });
        
        if (proPlayer.Ads.length > 0) {
            const error = new Error('Cannot delete pro player with associated relations');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
    }
});

// Custom create, different from normal creates
async function create(id) {
    const user = await User.findByPk(id, { include: ProPlayer });
    
    if (!user) {
        const error = new Error(`No User found by ID: ${id}`);
        error.status = StatusCodes.NOT_FOUND;
        throw error;
    }
    
    if (user.ProPlayer) {
        const error = new Error('This user is already registered as a pro player');
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }
    
    const proPlayer = await ProPlayer.create({ id: id });
    const proPlayerRole = await Role.findOne({ where: { name: 'ProPlayer' } });
    if (proPlayerRole) await user.addRole(proPlayerRole);
    
    return proPlayer;
}

// Get games for a pro player
async function getGames(id) {
    const proPlayer = await proPlayerService.findById(id, { 
        include: {
            model: Game,
            through: { attributes: [] }
        }
    });
    return proPlayer.Games;
}

// Assign a game to a pro player
async function assignGame(id, data) {
    const proPlayer = await proPlayerService.findById(id, { include: Game });
    
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

// Update an assigned game
async function updateAssignedGame(id, game_id, data) {
    const proPlayer = await proPlayerService.findById(id, { include: Game });
    
    if (!proPlayer.Games.some(game => game.id == game_id)) {
        const error = new Error('This game is not assigned to this pro player');
        error.status = StatusCodes.NOT_FOUND;
        throw error;
    }
    
    await ProPlayerGame.update(data, {
        where: {
            pro_player_id: id,
            game_id: game_id
        }
    });
    
    return await ProPlayerGame.findOne({ 
        where: { 
            pro_player_id: id, 
            game_id: game_id 
        } 
    });
}

// Get reviews for a pro player
async function getReviews(id) {
    const proPlayer = await proPlayerService.findById(id, { include: Review });
    return proPlayer.Reviews;
}

export default {
    getAll: proPlayerService.findAll.bind(proPlayerService),
    getById: proPlayerService.findById.bind(proPlayerService),
    create,
    update: proPlayerService.update.bind(proPlayerService),
    remove: proPlayerService.delete.bind(proPlayerService),
    getGames,
    assignGame,
    updateAssignedGame,
    getReviews
};