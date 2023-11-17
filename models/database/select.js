const db = require('../../config/database');

/**
 * Executes a SELECT query on the database table.
 *
 * @param {string} table - The name of the table to select from.
 * @param {string} [columns='*'] - The columns to select. Defaults to all columns.
 * @param {string} [conditions=''] - The conditions to filter the rows.
 * @param {Array} [values=[]] - The values to be substituted in the query.
 * @return {Promise<Array>} A promise that resolves to an array of selected rows.
 */
async function select(table, columns = '*', conditions = '', values = []) {
    try {
        const query = `SELECT ${columns} FROM ${table} ${conditions}`;
        const [rows, fields] = await db.query(query, values);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = select;