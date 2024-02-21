const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

// Define a route handler for handling GET requests to retrieve all users
router.get('/', async (req, res, next) => {
    try {
        const users = await userController.getAll();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

// Define a route handler for handling GET requests to retrieve a user by specific id
router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const user = await userController.getById(id);
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
    const userId = parseInt(req.params.id);
    const userData = req.body;
    try {
        const rowsAffected = await userController.updateById(userId, userData);
        res.json({ rowsAffected });
    } catch (err) {
        next(err)
    }
});

// Define a route handler for handling DELETE requests to delete a user by id
router.delete('/:id', async (req, res, next) => {
    const userId = parseInt(req.params.id);
    try {
        const rowsAffected = await userController.deleteById(userId);
        res.json({ rowsAffected });
    } catch (err) {
        next(err)
    }
});

module.exports = {
    path: '/api/users',
    router,
};
