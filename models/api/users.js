const select = require('../database/select');
const insert = require('../database/insert');
const update = require('../database/update');
const remove = require('../database/delete');

const table = 'users';
const fields = 'id, username, email, role';

module.exports = {
    /**
     * Retrieves all the rows from the table.
     *
     * @param {string} role - role to filter by
     * @return {Promise<Array>} An array of rows from the table.
     */
    getAll: async (role) => {
        try {
            const rows = await select(table, fields, 'WHERE role = ?', [role]);
            return rows;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Asynchronously gets a row by a specified role and value.
     *
     * @param {string} by - the column to search by
     * @param {string} value - the value to search for
     * @param {string} role - the role to search for
     * @return {object} the first row found
     */
    get: async (by, value, role) => {
        try {
            const rows = await select(table, fields, `WHERE ${by} = ? and role = ?`, [value, role]);
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