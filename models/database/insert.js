const db = require('../../config/database');

/**
 * Inserts data into the specified table.
 *
 * @param {string} table - The name of the table to insert into.
 * @param {object} data - The data to be inserted.
 * @return {number} The ID of the inserted data.
 */
async function insert(table, data) {
    try {
        const query = `INSERT INTO ${table} SET ?`;
        const [result] = await db.query(query, [data]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

module.exports = insert;