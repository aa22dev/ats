const db = require('../../config/database');

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