const select = require('./database/select');
const insert = require('./database/insert');
const update = require('./database/update');
const remove = require('./database/delete');

const table = 'users';

module.exports = {
    getAll: async () => {
        try {
            return await select(table);
        } catch(err) {
            throw err;
        }
    },
    getById: async (id) => {
        try {
            const rows = await select(table, '*', 'WHERE id = ?', [id]);
            return rows[0];
        } catch (err) {
            throw err;
        }
    },
    create: async (data) => {
        try {
            const row = await insert(table, data);
            return row.insertId;
        } catch (err) {
            throw err;
        }
    },
    updateById: async (id, data) => {
        try {
            const row = await update(table, data, 'WHERE id = ?', [id]);
            return row.affectedRows;
        } catch (err) {
            throw err;
        }
    },
    deleteById: async (id) => {
        try {
            const row = await remove(table, 'WHERE id = ?', [id]);
            return row.affectedRows;
        } catch (err) {
            throw err;
        }
    }
};