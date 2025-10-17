import { Ad, Reservation } from "../database-helper.js";
import createService from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

const adService = createService(Ad, {
    buildWhereClause: (options) => {
        const conditions = [
            options.service_type && { service_type: options.service_type },
            options.game_id && { game_id: options.game_id },
            options.pro_player_id && { pro_player_id: options.pro_player_id }
        ].filter(Boolean);
        
        return conditions.length > 0 ? { [Op.or]: conditions } : {};
    },
    beforeDelete: async (ad) => {
        await ad.reload({ include: [Reservation] });
        
        if (ad.Reservations.length > 0) {
            const error = new Error('Cannot delete ad with associated reservations');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
    }
});

const getAllWithAvailableSpots = async (options = {}) => {
    const ads = await adService.findAll(options);
    
    const adsWithSpots = await Promise.all(
        ads.map(async (ad) => {
            const activeReservations = await Reservation.count({
                where: {
                    ad_id: ad.id,
                    status: { [Op.notIn]: ['Cancelled', 'Completed'] }
                }
            });
            
            const spots_still_available = Math.max(0, ad.total_spots_available - activeReservations);
            
            return {
                ...ad.toJSON(),
                metadata: {
                    spots_still_available: spots_still_available
                }
            };
        })
    );
    
    return adsWithSpots;
};

export default {
    getAll: adService.findAll.bind(adService),
    getById: adService.findById.bind(adService),
    create: adService.create.bind(adService),
    update: adService.update.bind(adService),
    remove: adService.delete.bind(adService),
    getAllWithAvailableSpots
};