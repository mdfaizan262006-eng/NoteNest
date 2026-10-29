
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
    res.send('NoteNest backend is running!');
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'NoteNest API is working!',
    });
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

startServer();
