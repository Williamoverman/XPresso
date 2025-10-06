import { StatusCodes } from 'http-status-codes';
import proPlayerQueries from '../db/helpers/pro-player-helper.js';

const getAllProPlayers = async (req, res, next) => {
    try {
        const proPlayers = await proPlayerQueries.getAll();
        res.status(StatusCodes.OK).json(proPlayers);
    } catch (error) {
        next(error);
    }
}

const getProPlayerById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const proPlayer = await proPlayerQueries.getById(id);
        res.status(StatusCodes.OK).json(proPlayer);
    } catch (error) {
        next(error);
    }
}

const createProPlayer = async (req, res, next) => {
    try {
        const { id } = req.params;

        const newProPlayer = await proPlayerQueries.create(id);
        res.status(StatusCodes.CREATED).json(newProPlayer);
    } catch (error) {
        next(error);
    }
}

const updateProPlayer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { bio, hourly_rate } = req.body;

        const input = {
            bio: bio,
            hourly_rate: hourly_rate
        }

        const updatedProPlayer = await proPlayerQueries.update(id, input);
        res.status(StatusCodes.OK).json(updatedProPlayer);
    } catch (error) {
        next(error);
    }
}

const deleteProPlayer = async (req, res, next) => {
    try {
        const { id } = req.params;

        await proPlayerQueries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

const getGamesForProPlayer = async (req, res, next) => {
    try {
        const { id } = req.params;

        const games = await proPlayerQueries.getGames(id);
        res.status(StatusCodes.OK).json(games);
    } catch (error) {
        next(error);
    }
}

const AssignGameToProPlayer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { game_id, current_rank, years_experience } = req.body;

        const input = {
            game_id: game_id,
            current_rank: current_rank,
            years_experience: years_experience
        }

        const assignedGame = await proPlayerQueries.assignGame(id, input);
        res.status(StatusCodes.CREATED).json(assignedGame);
    } catch (error) {
        next(error);
    }
}

const UpdateProPlayerGameDetails = async (req, res, next) => {
    try {
        const { id, game_id } = req.params;
        const { current_rank, years_experience } = req.body;

        const input = {}

        if (current_rank) input.current_rank = current_rank;
        if (years_experience) input.years_experience = years_experience;

        const updatedAssignedGame = await proPlayerQueries.updateAssignedGame(id, game_id, input);
        res.status(StatusCodes.OK).json(updatedAssignedGame);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllProPlayers,
    getProPlayerById,
    createProPlayer,
    updateProPlayer,
    deleteProPlayer,
    getGamesForProPlayer,
    AssignGameToProPlayer,
    UpdateProPlayerGameDetails
}