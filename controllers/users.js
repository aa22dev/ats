const model = require('../models/users');
const argon2 = require('argon2');
const { throwErr } = require('../utils/error');
const checker = require('../utils/dataValidityChecker');

/**
 * Checks the data based on the given action.
 *
 * @param {object} data - The data to be checked.
 * @param {string} action - The action to be performed on data to be checked.
 * @throws {Error} If any required field is missing for any action.
 */
function checkData(data, action) {
    if (action === 'id') {
        if (isNaN(data) || !Number.isInteger(data)) {
            throwErr('User ID not defined', 400);
        }
    }

}

module.exports = {
    /**
     * Retrieves all the users from the model.
     *
     * @return {Promise<Array>} An array containing all the users.
     * @throws {Error} If no data is found.
     */
    getAll: async function() {
        try {
            const users = await model.getAll();

            if (users.length === 0) {
                throwErr("No data found", 404);
            }

            return users;
        } catch (err) {
            throw err;
        }
    },
    
    /**
     * Retrieves a user by their ID.
     *
     * @param {number} id - The ID of the user to retrieve.
     * @return {Promise<Object>} The user object if found.
     * @throws {Error} If the user is not found.
     */
    getById: async function(id) {
        try {
            checkData(id, 'id')
            const user = await model.get('id', id);
            if (!user) {
                throwErr("User not found", 404);
            }
            return user;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Retrieves a user by their username.
     *
     * @param {string} username - The username of the user to retrieve.
     * @return {Object<Promise>} The user object if found.
     * @throws {Error} If the user is not found.
     */
    getByUsername: async function(username) {
        try {
            const user = await model.get('username', username);
            if (!user) {
                throwErr("User not found", 404);
            }
            return user;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Retrieves a user by their email.
     *
     * @param {string} username - The email of the user to retrieve.
     * @return {Object<Promise>} The user object if found.
     * @throws {Error} If the user is not found.
     */
    getByEmail: async function(email) {
        try {
            const user = await model.get('email', email);
            if (!user) {
                throwErr("User not found", 404);
            }
            return user;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Retrieves the total count of users by their username.
     *
     * @param {string} username - The username of the user.
     * @return {number} The total count of users with the given username.
     */
    totalByUsername: async function(username) {
        try {
            const user = await model.count('username', username);
            return user;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Retrieves the total count of users by email.
     *
     * @param {string} email - The email to search for.
     * @return {Promise<number>} The total count of users with the given email.
     */
    totalByEmail: async function(email) {
        try {
            const user = await model.count('email', email);
            return user;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Create a new user.
     *
     * @param {Object} data - The user data.
     * @return {Promise<number>} The ID of the created user.
     */
    createUser: async function(data) {
        try {
            await checker.all(data, this.totalByUsername, this.totalByEmail);
            data.password = await argon2.hash(data.password);
            const id = await model.create(data);
            return id;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Updates a record in the database by its ID.
     *
     * @param {number} id - The ID of the record to be updated.
     * @param {Object} data - The data to update the record with.
     * @return {Promise<number>} The number of rows affected by the update.
     */
    updateById: async function(id, data) {
        try {
            checkData(id, 'id');
            if (data.password) {
                data.password = await argon2.hash(data.password);
            }
            const rowsAffected = await model.updateById(id, data);
            if (rowsAffected === 0) {
                throw new Error("User not found");
            }
            return rowsAffected;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Deletes a record from the database by its ID.
     *
     * @param {number} id - The ID of the record to be deleted.
     * @return {Promise<number>} The number of affected rows.
     */
    deleteById: async function(id) {
        try {
            checkData(id, 'id')
            const rowsAffected = await model.deleteById(id);
            if (rowsAffected === 0) {
                throw new Error("User not found");
            }
            return rowsAffected;
        } catch (err) {
            throw err;
        }
    },
};
