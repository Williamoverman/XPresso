import { StatusCodes } from 'http-status-codes';
import gameQueries from '../db/helpers/game-helper.js';

const getAllGames = async (req, res, next) => {
    try {
        const games = await gameQueries.getAll();
        res.status(StatusCodes.OK).json(games);
    } catch (error) {
        next(error);
    }
}

const getGameById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const game = await gameQueries.getById(id);
        res.status(StatusCodes.OK).json(game);
    } catch (error) {
        next(error);
    }
}

const createGame = async (req, res, next) => {
    try {
        const { name, abbreviation } = req.body;

        if (!name || !abbreviation) {
            const error = new Error('Name and abbreviation are required');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const input = {
            name: name,
            abbreviation: abbreviation
        }

        const createdGame = await gameQueries.create(input);
        res.status(StatusCodes.CREATED).json(createdGame);
    } catch (error) {
        next(error);
    }
}

const updateGame = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, abbreviation } = req.body;

        if (!name || !abbreviation) {
            const error = new Error('Name and abbreviation are required');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const input = {
            name: name,
            abbreviation: abbreviation
        }

        const updatedGame = await gameQueries.update(input, id);
        res.status(StatusCodes.OK).json(updatedGame);
    } catch (error) {
        next(error);
    }
}

const deleteGame = async (req, res, next) => {
    try {
        const { id } = req.params;

        await gameQueries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

const getAdsForGame = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ads = await gameQueries.getAds(id);
        res.status(StatusCodes.OK).json(ads);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getAdsForGame
}