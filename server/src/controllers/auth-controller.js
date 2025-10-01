import { StatusCodes } from 'http-status-codes';

const login = (req, res, next) => {
    try {
        const { email, password } = req.body;
        
    } catch (error) {
        next(error);
    }
}

const logout = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

export default {
    login,
    logout
}