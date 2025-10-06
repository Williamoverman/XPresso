import { StatusCodes } from 'http-status-codes';

function createService(model, options = {}) {
    const { 
        beforeDelete = null,
        buildWhereClause = null,
        defaultIncludes = {},
        defaultExcludes = {}
    } = options;

    return {
        async findAll(queryOptions = {}, excludes = defaultExcludes) {
            let finalOptions = { ...queryOptions };
            if (buildWhereClause) {
                const customWhere = buildWhereClause(queryOptions);
                finalOptions.where = customWhere;
            }
            
            return await model.findAll({
                ...finalOptions,
                attributes: excludes
            });
        },  

        async findById(id, includes = defaultIncludes, excludes = defaultExcludes) {
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
        },

        async create(data, excludes = defaultExcludes) {
            const record = await model.create(data);
            return this.findById(record.id, {}, excludes);
        },

        async update(id, data, excludes = defaultExcludes) {
            const record = await this.findById(id);
            await record.update(data);
            return this.findById(id, {}, excludes);
        },

        async delete(id) {
            const record = await this.findById(id);
            
            if (beforeDelete) {
                await beforeDelete(record);
            }
            
            await record.destroy();
            return;
        }
    };
}

export default createService;