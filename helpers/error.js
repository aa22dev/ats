module.exports = {
    /**
     * Throws an error with a specified message and status code.
     *
     * @param {string} msg - The error message.
     * @param {number} code - The status code.
     * @throws {Error} The error object with the specified message and status code.
     */
    throwErr: (msg, code) => {
        const err = new Error(msg);
        err.statusCode = code;
        throw err;
    }
}