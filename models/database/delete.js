const db = require('../../config/database');

/**
 * Deletes records from the specified table based on the given conditions.
 *
 * @param {string} table - The name of the table to delete records from.
 * @param {string} conditions - The conditions to determine which records to delete.
 * @param {Array} values - The values to replace any placeholders in the conditions.
 * @return {number} The number of affected rows after the deletion.
 */
async function del(table, conditions, values) {
    try {
        const query = `DELETE FROM ${table} ${conditions}`;
        const [result] = await db.query(query, values);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

module.exports = del;