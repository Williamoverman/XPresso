import { Ad, ProPlayer, Reservation, Review } from "../database-helper.js";
import createService from "../helpers/generic-helper.js";

const reviewService = createService(Review, {
    buildWhereClause: (options) => {
        const where = {};
        
        if (options.pro_player_id) where.pro_player_id = options.pro_player_id;
        if (options.user_id) where.user_id = options.user_id;

        return where;
    }
});

export default {
    getAll: reviewService.findAll.bind(reviewService),
    getById: reviewService.findById.bind(reviewService),
    create: reviewService.create.bind(reviewService),
    update: reviewService.update.bind(reviewService),
    remove: reviewService.delete.bind(reviewService)
};