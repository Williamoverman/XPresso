import { User, Role, Reservation, Review } from "../database-helper.js";
import createService from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

const userService = createService(User, {
    defaultExcludes: { exclude: ['password'] },
    beforeDelete: async (user) => {
        await user.reload({ include: [Reservation] });
        
        if (user.Reservations.length > 0) {
            const error = new Error('Cannot delete user with associated relations');
            error.status = StatusCodes.BAD_REQUEST;
            throw error;
        }
    }
});

async function create(data) {
    const user = await userService.create(data);
    
    const userRole = await Role.findOne({ where: { name: 'User' } });
    if (userRole) await user.addRole(userRole);

    return user;
}

async function getRolesById(id) {
    const user = await userService.findById(id, { include: {
            model: Role,
            through: { attributes: [] }
        }});
    return user.Roles;
}

async function addRole(id, role_id) {
    const user = await userService.findById(id, { include: Role });
    if (await user.hasRole(role_id)) {
        const error = new Error(`User already has role assigned`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }

    return await user.addRole(role_id);
}

async function toggleActive(id, active) {
    const user = await userService.findById(id);
    if (user.is_active === active) {
        const error = new Error(`User is already ${active ? "activated" : "deactivated"}`);
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    }
    user.is_active = active;
    await user.save();
    return user;
}

export default {
    getAll: userService.findAll.bind(userService),
    getById: userService.findById.bind(userService),
    create,
    update: userService.update.bind(userService),
    remove: userService.delete.bind(userService),
    getRolesById,
    addRole,
    toggleActive
};