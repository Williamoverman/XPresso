import { Role, User } from "../database-helper.js";
import createService from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

const reservationService = createService(Role, {
    defaultExcludes: { exclude: ['password'] },
    beforeDelete: async (role) => {
        await role.reload({ include: [User] });
        
        if (role.Users.length > 0) {
            const error = new Error('Cannot delete role with associated users');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
    }
});

async function getUsers(id) {
    const role = await reservationService.findById(id, { include: {
            model: User,
            attributes: { exclude: ['password'] },
            through: { attributes: [] }
        }});

    return role.Users;
}

export default {
    getAll: reservationService.findAll.bind(reservationService),
    getById: reservationService.findById.bind(reservationService),
    create: reservationService.create.bind(reservationService),
    update: reservationService.update.bind(reservationService),
    remove: reservationService.delete.bind(reservationService),
    getUsers
};