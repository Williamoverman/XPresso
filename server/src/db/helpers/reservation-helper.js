import { Ad, Reservation, User } from "../database-helper.js";
import createService from "../helpers/generic-helper.js"

const reservationService = createService(Reservation, {
    buildWhereClause: (options) => {
        const where = {};
        
        if (options.user_id) where.user_id = options.user_id;
        if (options.ad_id)  where.ad_id = options.ad_id;
        
        return where;
    }
});

async function findAllAdmin() {
    return reservationService.findAll({
        include: [
            { model: User, attributes: ['id', 'username', 'email'] },
            { model: Ad, attributes: ['id', 'name', 'service_type'] }
        ]
    });
}

export default {
    findAllAdmin,
    getAll: reservationService.findAll.bind(reservationService),
    getById: reservationService.findById.bind(reservationService),
    create: reservationService.create.bind(reservationService),
    update: reservationService.update.bind(reservationService),
    remove: reservationService.delete.bind(reservationService)
};