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
        } catch(err) {
            throw err;
        }
    },
    /**
     * Retrieves a row from the database table by the given id.
     *
     * @param {number} id - The id of the row to retrieve.
     * @return {Promise<Object>} The retrieved row.
     */
    getById: async (id) => {
        try {
            const rows = await select(table, '*', 'WHERE id = ?', [id]);
            return rows[0];
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
            const row = await insert(table, data);
            return row.insertId;
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
            const row = await update(table, data, 'WHERE id = ?', [id]);
            return row.affectedRows;
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
            const row = await remove(table, 'WHERE id = ?', [id]);
            return row.affectedRows;
        } catch (err) {
            throw err;
        }
    }
};