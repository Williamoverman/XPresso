import { StatusCodes } from 'http-status-codes';
import { Ad, Reservation } from '../db/database-helper.js';
import { Op } from 'sequelize';
import createService from '../db/helpers/generic-helper.js';

const adService = createService(Ad);
const reservationService = createService(Reservation);

/**
 * Middleware to check if there are enough spots available for a reservation
 */
async function checkAvailableSpots(req, res, next) {
    try {
        const { ad_id } = req.body;

        const ad = await adService.findById(ad_id);

        const activeReservations = await reservationService.findAll({
            where: {
                ad_id: ad_id,
                status: { [Op.notIn]: ['Cancelled', 'Completed'] }
            }
        });

        if (activeReservations.length >= ad.total_spots_available) {
            const error = new Error('Geen plek meer voor deze advertentie');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Middleware to check if reservation dates are within ad's max_duration_minutes
 */
async function checkReservationDuration(req, res, next) {
    try {
        const { start_date, end_date } = req.body;
        let ad_id;

        if (req.body.ad_id)
            ad_id = req.body.ad_id;
        else if (req.params.id) {
            const reservation = await reservationService.findById(req.params.id);
            ad_id = reservation.ad_id;
        }

        const ad = await adService.findById(ad_id);

        const start = new Date(start_date);
        const end = new Date(end_date);
        const durationMinutes = (end - start) / (1000 * 60);

        if (durationMinutes > ad.max_duration_minutes) {
            const error = new Error(`Totale reserveringstijd gaat over het limiet heen van: ${ad.max_duration_minutes} minuten`);
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Middleware to check if user has not exceeded max_reservations_per_user for an ad
 */
async function checkUserReservationLimit(req, res, next) {
    try {
        const { ad_id } = req.body;

        const ad = await adService.findById(ad_id);

        const targetUserId = req.user.id;

        const userReservations = await reservationService.findAll({
            where: {
                ad_id: ad_id,
                user_id: targetUserId,
                status: { [Op.notIn]: ['Cancelled', 'Completed'] }
            }
        });

        if (userReservations.length >= ad.max_reservations_per_user) {
            const error = new Error(`Maximum reserverings limiet bereikt: ${ad.max_reservations_per_user} voor deze advertentie`);
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default {
    checkAvailableSpots,
    checkReservationDuration,
    checkUserReservationLimit
};