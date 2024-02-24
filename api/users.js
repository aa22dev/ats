const express = require('express');
const router = express.Router();
const userController = require('../controllers/api/users');

// Define a route handler for handling GET requests to retrieve all users
router.get('/:role', async (req, res, next) => {
    try {
        const users = await userController.getAll(req.params.role);
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

// Define a route handler for handling GET requests to retrieve a user by specific id
router.get('/:role/:id', async (req, res, next) => {
    try {
        const user = await userController.getById(req.params.id, req.params.role);
        res.status(200).json(user);
    } catch (err) {
        next(err)
    }
});

// Define a route handler for handling POST requests to create a user
router.post('/', async (req, res, next) => {
    try {
        const id = await userController.createUser(req.body);
        res.status(201).json({ id });
    } catch (err) {
        next(err)
    }
});

// Define a route handler for handling PUT requests to update a user by id
router.put('/:id', async (req, res, next) => {
    try {
        const rowsAffected = await userController.updateById(req.params.id, req.body);
        res.json({ rowsAffected });
    } catch (err) {
        next(err)
    }
});

// Define a route handler for handling DELETE requests to delete a user by id
router.delete('/:id', async (req, res, next) => {
    try {
        const rowsAffected = await userController.deleteById(req.params.id);
        res.json({ rowsAffected });
    } catch (err) {
        next(err)
    }
});

module.exports = {
    path: '/api/users',
    router,
};
