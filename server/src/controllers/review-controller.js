import { StatusCodes } from 'http-status-codes';
import reviewQueries from '../db/helpers/review-helper.js';

const getAllReviews = async (req, res, next) => {
    try {
        const { pro_player_id, user_id } = req.query;

        const reviews = await reviewQueries.getAll({ pro_player_id, user_id });
        res.status(StatusCodes.OK).json(reviews);
    } catch (error) {
        next(error);
    }
}

const getReviewById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reviews = await reviewQueries.getById(id);
        res.status(StatusCodes.OK).json(reviews);
    } catch (error) {
        next(error);
    }
}

const createReview = async (req, res, next) => {
    try {
        const { reservation_id, user_id, pro_player_id, rating, comment } = req.body;

        const input = {
            reservation_id: reservation_id,
            user_id: user_id,
            pro_player_id: pro_player_id,
            rating: rating,
            comment: comment
        }

        const createdReview = await reviewQueries.create(input);
        res.status(StatusCodes.CREATED).json(createdReview);
    } catch (error) {
        next(error);
    }
}

const updateReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        let input = {}

        if (rating) input.rating = rating;
        if (comment) input.comment = comment;

        const updatedReview = await reviewQueries.update(id, input);
        res.status(StatusCodes.OK).json(updatedReview);
    } catch (error) {
        next(error);
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;

        await reviewQueries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

export default {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
}