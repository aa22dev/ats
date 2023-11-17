const db = require('../../config/database');

/**
 * Updates a row in the specified table with the given data and conditions.
 *
 * @param {string} table - The name of the table to update.
 * @param {object} data - The data to update the row with.
 * @param {string} conditions - The conditions for updating the row.
 * @param {Array} values - The values to substitute in the conditions.
 * @return {number} The number of affected rows after the update.
 */
async function update(table, data, conditions, values) {
    try {
        const query = `UPDATE ${table} SET ? ${conditions}`;
        const [result] = await db.query(query, [data, ...values]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

module.exports = update;