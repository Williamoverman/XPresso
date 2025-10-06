import { Review } from "../database-helper.js";
import createService from "../helpers/generic-helper.js";

const reviewService = createService(Review);

export default {
    getAll: reviewService.findAll.bind(reviewService),
    getById: reviewService.findById.bind(reviewService),
    create: reviewService.create.bind(reviewService),
    update: reviewService.update.bind(reviewService),
    remove: reviewService.delete.bind(reviewService)
};