const select = require('./database/select');
const insert = require('./database/insert');
const update = require('./database/update');
const remove = require('./database/delete');

const table = 'users';

module.exports = {
    /**
     * Retrieves all the rows from the table.
     *
     * @return {Promise<Array>} An array of rows from the table.
     */
    getAll: async () => {
        try {
            const rows = await select(table);
            return rows;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Retrieves a single row from the table based on the provided criteria.
     *
     * @param {string} by - The column name to search by.
     * @param {any} value - The value to search for.
     * @return {Promise<object>} The retrieved row from the table.
     */
    get: async (by, value) => {
        try {
            const rows = await select(table, '*', `WHERE ${by} = ?`, [value]);
            return rows[0];
        } catch (err) {
            throw err;
        }
    },

    /**
     * Count the number of rows in the table based on a specific condition.
     *
     * @param {string} by - The column name to filter by.
     * @param {string} value - The value to filter by.
     * @return {number} The total number of rows that match the condition.
     */
    count: async (by, value) => {
        try {
            const total = await select(table, 'COUNT(*) as total', `WHERE ${by} = ?`, [value]);
            return total[0]['total'];
        } catch (err) {
            throw err;
        }
    },

    /**
     * Creates a new entry in the table with the provided data.
     *
     * @param {Object} data - The data to be inserted into the table.
     * @return {Promise<number>} The ID of the newly inserted row.
     */
    create: async (data) => {
        try {
            const insertId = await insert(table, data);
            return insertId;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Updates a record in the database table by its ID.
     *
     * @param {number} id - The ID of the record to update.
     * @param {object} data - The updated data to be applied to the record.
     * @return {Promise<number>} The number of affected rows in the database.
     */
    updateById: async (id, data) => {
        try {
            const rowsAffected = await update(table, data, 'WHERE id = ?', [id]);
            return rowsAffected;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Deletes a record from the database by its ID.
     *
     * @param {number} id - The ID of the record to be deleted.
     * @return {Promise<number>} The number of affected rows.
     */
    deleteById: async (id) => {
        try {
            const rowsAffected = await remove(table, 'WHERE id = ?', [id]);
            return rowsAffected;
        } catch (err) {
            throw err;
        }
    }
};