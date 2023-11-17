const db = require('../../config/database');

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