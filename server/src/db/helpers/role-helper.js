import { Role, User } from "../database-helper.js";
import createService from "../helpers/generic-helper.js"
import { StatusCodes } from "http-status-codes";

const roleService = createService(Role, {
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
    const role = await roleService.findById(id, { include: {
            model: User,
            attributes: { exclude: ['password'] },
            through: { attributes: [] }
        }});

    return role.Users;
}

export default {
    getAll: roleService.findAll.bind(roleService),
    getById: roleService.findById.bind(roleService),
    create: roleService.create.bind(roleService),
    update: roleService.update.bind(roleService),
    remove: roleService.delete.bind(roleService),
    getUsers
};