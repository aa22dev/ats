// const err = require('./error');

module.exports = {
    url: {
        ensureHttps(url) {
            if (!/^https?:\/\//i.test(url)) {
                return `https://${url}`;
            }
            return url;
        },
        isValidUrl(url) {
            const protocolRegex = /(?:(http|https):\/\/)?/;
            const domainRegex = /[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-z]{2,}/;

            if (!(protocolRegex.test(url) && (protocolRegex.test(url) ? domainRegex.test(url.slice(protocolRegex.exec(url)[0].length)) : domainRegex.test(url)))) throwErr('Invalid URL', 400);
        },
        github: {
            check(url) {
                if (!/^(http|https):\/\/(?:www\.)?github.com\/([^\s\/]+)\/?$/i.test(url)) throwErr('Invalid GitHub URL', 400);
            }
        },
        linkedin: {
            check(url) {
                if (!/^(http|https):\/\/(?:www\.)?linkedin.com\/in\/([^\s\/]+)\/?$/i.test(url)) throwErr('Invalid LinkedIn URL', 400);
            }
        }

    },

    id: {
        /**
        * Validates the user ID.
        *
        * @param {string} id - The user ID to be validated
        */
        validate(id) {
            if (!/^\d+$/.test(id)) throwErr('ID not defined', 400);
        }
    },

    name: {
        isValid(name) {
            const allowedChars = /^[a-zA-Z\-'\s]+$/;
            if (!allowedChars.test(name)) throwErr('Name can only contain letters, hyphens, apostrophes, and spaces', 400);
        },
        length(name) {
            if (name.length < 2 || name.length > 50) throwErr('Name must be between 2 and 50 characters long', 400);
        }
    },

    username: {
        /**
        * Checks if a username already exists in the database.
        *
        * @param {string} username - The username to check.
        * @param {function} totalByUsername - The function to get the total count of users by username.
        * @throws {Error} Throws an error if the username already exists.
        */
        async isExist(username, companyId, checker) {
            try {
                const user = await checker(username, companyId)
                console.log(user)
                if (user) throwErr('Username already exists', 409);
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
            if (!username) throwErr('Username is required', 400);
        },

        /**
        * Checks the length of the username.
        *
        * @param {string} username - The username to check.
        */
        length(username) {
            if (username.length < 4) throwErr('Username must be greater than or equal to 4 characters', 400);
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
            if (!password) throwErr('Password is required', 400);
        },

        /**
        * Checks if a password meets the security requirements.
        *
        * @param {string} password - The password to be checked.
        * @throws {Error} If the password is not secure.
        */
        isSecure(password) {
            if (password.length < 8) throwErr('Password must be at least 8 characters long', 400);
            if (!/[a-z]/.test(password)) throwErr('Password must have atleast one lowercase letter', 400);
            if (!/[A-Z]/.test(password)) throwErr('Password must have atleast one uppercase letter', 400);
            if (!/\d/.test(password)) throwErr('Password must have at least one digit', 400);
            if (!/[!@#$%^&*]/.test(password)) throwErr('Password must have atleast one special character (e.g., !@#$%^&*)', 400);
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
            if (!email) throwErr('Email is required', 400);
        },

        /**
        * Validates if the given email is in a valid format.
        *
        * @param {string} email - The email to be validated.
        * @throws {Error} If the email is not in a valid format.
        */
        isValid(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) throwErr('Invalid email address', 400);
        },

        /**
        * Check if the email exists in the database.
        *
        * @param {string} email - The email to check.
        * @param {function} getByEmail - The function to get users by email.
        */
        async isExist(email, companyId, checker) {
            try {
                const user = await checker(email, companyId);
                if (user) throwErr('Email already exists', 409);
            } catch (e) {
                throw e;
            }
        },
    },
    role: {
        /**
        * Checks if the given role is valid.
        *
        * @param {string} role - The role to be checked.
        * @throws {Err} Throws an error if the role is invalid or not provided.
        */
        validate(role) {
            if (!role) throwErr('Role is required', 400);
            if (!['admin', 'company', 'employer', 'applicant'].includes(role)) throwErr('Invalid Role', 400);
        },

        /**
         * Validates the role for API access.
         *
         * @param {string} role - the role to be validated
         */
        apiValidate(role) {
            if (!['employer', 'applicant'].includes(role)) throwErr("API Endpoint Not Found", 404);
        }
    }
}