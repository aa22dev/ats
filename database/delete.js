const db = require('../config/database');

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