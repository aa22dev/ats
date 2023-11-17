const select = require('./database/select');
const insert = require('./database/insert');
const update = require('./database/update');
const remove = require('./database/delete');

module.exports = {
    getAll: async () => {
        try {
            return await select('users');
        } catch(err) {
            throw err;
        }
    },
    get: async (uid) => {
        try {
            const rows = await select('users', '*', 'WHERE id = ?', [uid]);
            return rows[0];
        } catch (err) {
            throw err;
        }
    },
    create: async (data) => {
        try {
            const row = await insert('users', data);
            return row.insertId;
        } catch (err) {
            throw err;
        }
    },
    update: async (id, data) => {
        try {
            const row = await update('users', data, 'WHERE id = ?', [id]);
            return row.affectedRows;
        } catch (err) {
            throw err;
        }
    },
    delete: async (id) => {
        try {
            const row = await remove('users', 'WHERE id = ?', [id]);
            return row.affectedRows;
        } catch (err) {
            throw err;
        }
    }
}