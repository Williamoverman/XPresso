import { StatusCodes } from "http-status-codes";
import { User, Role } from "../database-helper.js";
import createService from "./generic-helper.js";

async function getByEmail(email) {
    const user = await User.findOne({ 
        where: { email }, 
        include: Role,
    });

    if (!user) {
        const error = new Error('No user found by email');
        error.status = StatusCodes.NOT_FOUND;
        throw error;
    }
    
    return user;
}

async function getById(id) {
    const userService = createService(User, {
        defaultIncludes: { include: Role }
    });

    const user = await userService.findById(id);

    return user;
}

export default {
    getByEmail,
    getById
}