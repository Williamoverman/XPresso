import { Reservation } from "../database-helper.js";
import createService from "../helpers/generic-helper.js"

const reservationService = createService(Reservation, {
    buildWhereClause: (options) => {
        return options.ad_id ? { ad_id: options.ad_id } : {}; 
    }
});

export default {
    getAll: reservationService.findAll.bind(reservationService),
    getById: reservationService.findById.bind(reservationService),
    create: reservationService.create.bind(reservationService),
    update: reservationService.update.bind(reservationService),
    remove: reservationService.delete.bind(reservationService)
};