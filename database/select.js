const db = require('../config/database');

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