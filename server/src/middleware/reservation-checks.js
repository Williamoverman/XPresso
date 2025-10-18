import { StatusCodes } from 'http-status-codes';
import { Ad, Reservation } from '../db/database-helper.js';
import { Op } from 'sequelize';

/**
 * Middleware to check if there are enough spots available for a reservation
 */
async function checkAvailableSpots(req, res, next) {
    const transaction = await Reservation.sequelize.transaction();
    try {
        const { ad_id } = req.body;

        const ad = await Ad.findByPk(ad_id, { transaction });
        const activeReservations = await Reservation.count({
            where: {
                ad_id: ad_id,
                status: { [Op.notIn]: ['Cancelled', 'Completed'] }
            },
            transaction
        });

        if (activeReservations >= ad.total_spots_available) {
            const error = new Error('No spots available for this ad');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }

        await transaction.commit();
        next();
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export default {
    checkAvailableSpots
}