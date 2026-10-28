const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes require authentication.
router.use(authMiddleware);

// GET: Fetch only the logged-in user's tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.userId,
        }).sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: 'Could not fetch tasks.',
        });
    }
});

// POST: Create a task for the logged-in user
router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            date,
            priority,
            done,
            favorite,
        } = req.body;

        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                message: 'Task title is required.',
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description,
            category,
            date,
            priority,
            done,
            favorite,
            user: req.user.userId,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

// PUT: Update only a task owned by this user
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid task ID.',
            });
        }

        // Only allow these fields to be changed.
        const allowedFields = [
            'title',
            'description',
            'category',
            'date',
            'priority',
            'done',
            'favorite',
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (
            updates.title !== undefined &&
            (typeof updates.title !== 'string' ||
                !updates.title.trim())
        ) {
            return res.status(400).json({
                message: 'Task title cannot be empty.',
            });
        }

        if (typeof updates.title === 'string') {
            updates.title = updates.title.trim();
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found.',
            });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

// DELETE: Delete only a task owned by this user
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid task ID.',
            });
        }

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found.',
            });
        }

        res.json({
            message: 'Task deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Could not delete task.',
        });
    }
});

module.exports = router;