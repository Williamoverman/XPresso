import { StatusCodes } from 'http-status-codes';

// generic get all
async function findAll(model, options = {}, excludes = {}) {
    return await model.findAll({
        ...options,
        attributes: excludes
    });
}

// generic get by ID
async function findById(model, id, includes = {}, excludes = {}) {
    const record = await model.findByPk(id, {
        ...includes,
        attributes: excludes
    });
    if (!record) {
        const error = new Error(`No ${model.name} found by ID: ${id}`);
        error.status = StatusCodes.NOT_FOUND;
        throw error;
    }

    return record;
}

// generic create
async function createRecord(model, data, excludes = {}) {
    const record = await model.create(data);

    return findById(model, record.id, {}, excludes);
}

// generic update
async function updateRecord(model, id, data, excludes = {}) {
    const record = await findById(model, id);
    await record.update(data)
    return findById(model, id, {}, excludes)
}

// generic delete
async function deleteRecord(model, id) {
    const record = await findById(model, id);
    await record.destroy();
    return;
}

export default {
    findAll,
    findById,
    createRecord,
    updateRecord,
    deleteRecord
};