import { StatusCodes } from 'http-status-codes';
import reservationQueries from '../db/helpers/reservation-helper.js';

const getAllReservations = async (req, res, next) => {
    try {
        const { id, ad_id } = req.query;
        const reservations = await reservationQueries.getAll({ id, ad_id });
        res.status(StatusCodes.OK).json(reservations);
    } catch (error) {
        next(error);
    }
}

const getReservationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reservation = await reservationQueries.getById(id);
        res.status(StatusCodes.OK).json(reservation);
    } catch (error) {
        next(error);
    }
}

const createReservation = async (req, res, next) => {
    try {
        const { user_id, ad_id, customer_notes, start_date, end_date } = req.body;

        const input = {
            user_id: user_id,
            ad_id: ad_id,
            customer_notes: customer_notes,
            start_date: start_date,
            end_date: end_date
        };

        const createdReservation = await reservationQueries.create(input);
        res.status(StatusCodes.CREATED).json(createdReservation);
    } catch (error) {
        next(error);
    }
}

const updateReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, customer_notes, start_date, end_date } = req.body;

        let input = {};

        if (status) input.status = status;
        if (customer_notes) input.customer_notes = customer_notes;
        if (start_date) input.start_date = start_date;
        if (end_date) input.end_date = end_date;

        const updatedReservation = await reservationQueries.update(id, input);
        res.status(StatusCodes.OK).json(updatedReservation);
    } catch (error) {
        next(error);
    }
}

const deleteReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        await reservationQueries.remove(id);
        res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

export default {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
}