import { StatusCodes } from 'http-status-codes';
import adQueries from '../db/helpers/ad-helper.js';

const getAllAds = async (req, res, next) => {
    try {
        const { service_type, game_id, pro_player_id } = req.query;

        const options = {
            service_type: service_type,
            game_id: game_id,
            pro_player_id: pro_player_id
        };

        const ads = await adQueries.getAll(options);
        res.status(StatusCodes.OK).json(ads);
    } catch (error) {
        next(error);
    }
}

const getAdById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ad = await adQueries.getById(id);
        res.status(StatusCodes.OK).json(ad);
    } catch (error) {
        next(error);
    }
}

const createAd = async (req, res, next) => {
    try {
        const { 
            game_id, 
            pro_player_id, 
            name, 
            description, 
            max_reservations_per_user, 
            service_type, 
            total_spots_available, 
            max_duration_minutes
        } = req.body;

        if (!name || !max_reservations_per_user || !max_duration_minutes || !total_spots_available) {
            const error = new Error('Max reservations per user, max duration in minutes, total spots available and name are required');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const input = {
            game_id: game_id,
            pro_player_id: pro_player_id,
            name: name,
            description: description,
            max_reservations_per_user: max_reservations_per_user,
            service_type: service_type,
            total_spots_available: total_spots_available,
            max_duration_minutes: max_duration_minutes
        };

        const createdAd = await adQueries.create(input);
        res.status(StatusCodes.CREATED).json(createdAd);
    } catch (error) {
        next(error);
    }
}

const updateAd = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { 
            game_id, 
            pro_player_id, 
            name, 
            description, 
            max_reservations_per_user, 
            service_type, 
            total_spots_available, 
            max_duration_minutes
        } = req.body;

        let input = {};

        if (game_id) input.game_id = game_id;
        if (pro_player_id) input.pro_player_id = pro_player_id;
        if (name) input.name = name;
        if (description) input.description = description;
        if (max_reservations_per_user) input.max_reservations_per_user = max_reservations_per_user;
        if (service_type) input.service_type = service_type;
        if (total_spots_available) input.total_spots_available = total_spots_available;
        if (max_duration_minutes) input.max_duration_minutes = max_duration_minutes;

        const updatedAd = await adQueries.update(input, id);
        res.status(StatusCodes.OK).json(updatedAd);
    } catch (error) {
        next(error);
    }
}

const deleteAd = async (req, res, next) => {
    try {
        const { id } = req.params;

        await adQueries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

export default {
    getAllAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd
}