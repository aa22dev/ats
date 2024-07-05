const err = require('./error');

module.exports = {
    /**
    * Perform several operations on the given data.
    *
    * @param {object} data - An object containing the required data for the operations.
    * @param {function} totalByUsername - A function to calculate the total by username.
    * @param {function} totalByEmail - A function to calculate the total by email.
    */
    async all(data, totalByUsername, totalByEmail, request="normal", method="create") {
        if (method === "create") {
            (request == "normal") ? this.role.validate(data.role) : this.role.apiValidate(data.role);
            await this.username.all(data.username, totalByUsername);
            await this.email.all(data.email, totalByEmail);
            this.password.all(data.password);
        } else {
            if (data.role) (request == "normal") ? this.role.validate(data.role) : this.role.apiValidate(data.role);
            if (data.username) await this.username.all(data.username, totalByUsername);
            if (data.email) await this.email.all(data.email, totalByEmail);
            if (data.password) this.password.all(data.password);
        }
    },

    id: {
        /**
         * Validates the user ID.
         *
         * @param {string} id - The user ID to be validated
         */
        validate(id) {
            if (!/^\d+$/.test(id)) err.throwErr('User ID not defined', 400);
        }
    },

    username: {
        /**
        * Performs several operations for a given username.
        *
        * @param {string} username - the username to perform operations for
        * @param {function} totalByUsername - A function to calculate the total by username.
        */
        async all(username, totalByUsername) {
            this.check(username);
            this.length(username);
            await this.isExist(username, totalByUsername);
        },

        /**
        * Checks if a username already exists in the database.
        *
        * @param {string} username - The username to check.
        * @param {function} totalByUsername - The function to get the total count of users by username.
        * @throws {Error} Throws an error if the username already exists.
        */
        async isExist(username, totalByUsername) {
            try {
                const users = await totalByUsername(username)
                if (users > 0) err.throwErr('Username already exists', 409)
            } catch (e) {
                throw e;
            }
        },

        /**
        * A function to check the validity of a username.
        *
        * @param {string} username - the username to be checked
        */
        check(username) {
            if (!username) err.throwErr('Username is required', 400);
        },

        /**
        * Checks the length of the username.
        *
        * @param {string} username - The username to check.
        */
        length(username) {
            if (username.length < 4) err.throwErr('Username must be greater than or equal to 4 characters', 400);
        }
    },
    password: {
        /**
        * Executes the 'all' function.
        *
        * @param {type} password - the password to be checked
        */
        all(password) {
            this.check(password);
            this.isSecure(password);
        },

        /**
        * Check if a password is provided.
        *
        * @param {string} password - The password to check.
        */
        check(password) {
            if (!password) err.throwErr('Password is required', 400);
        },

        /**
        * Checks if a password meets the security requirements.
        *
        * @param {string} password - The password to be checked.
        * @throws {Error} If the password is not secure.
        */
        isSecure(password) {
            if (password.length < 8) err.throwErr('Password must be at least 8 characters long', 400);
            if (!/[a-z]/.test(password)) err.throwErr('Password must have atleast one lowercase letter', 400);
            if (!/[A-Z]/.test(password)) err.throwErr('Password must have atleast one uppercase letter', 400);
            if (!/\d/.test(password)) err.throwErr('Password must have at least one digit', 400);
            if (!/[!@#$%^&*]/.test(password)) err.throwErr('Password must have atleast one special character (e.g., !@#$%^&*)', 400);
        }
    },
    email: {
        /**
        * Performs a series of tasks related to the given email.
        *
        * @param {string} email - The email to be processed.
        * @param {function} getByEmail - A function to retrieve data by email.
        */
        async all(email, getByEmail) {
            this.check(email);
            this.isValid(email);
            await this.isExist(email, getByEmail);
        },

        /**
        * Check if the given email is valid.
        *
        * @param {string} email - The email address to be checked.
        */
        check(email) {
            if (!email) err.throwErr('Email is required', 400);
        },

        /**
        * Validates if the given email is in a valid format.
        *
        * @param {string} email - The email to be validated.
        * @throws {Error} If the email is not in a valid format.
        */
        isValid(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) err.throwErr('Email is not of valid format', 400);
        },

        /**
        * Check if the email exists in the database.
        *
        * @param {string} email - The email to check.
        * @param {function} getByEmail - The function to get users by email.
        */
        async isExist(email, getByEmail) {
            try {
                const users = await getByEmail(email);
                if (users > 0) err.throwErr('Email already exists', 409);
            } catch (e) {
                throw e;
            }
        }
    },
    role: {
        /**
        * Checks if the given role is valid.
        *
        * @param {string} role - The role to be checked.
        * @throws {Err} Throws an error if the role is invalid or not provided.
        */
        validate(role) {
            if (!role) err.throwErr('Role is required', 400);
            if (!['admin', 'company', 'employer', 'applicant'].includes(role)) err.throwErr('Invalid Role', 400);
        },

        /**
         * Validates the role for API access.
         *
         * @param {string} role - the role to be validated
         */
        apiValidate(role) {
            if (!['employer', 'applicant'].includes(role)) err.throwErr("API Endpoint Not Found", 404);
        }
    }
}