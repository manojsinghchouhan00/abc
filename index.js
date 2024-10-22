const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('./db');
const itemsRouter = require('./routes/items');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());



// Middleware
app.use(express.json());
app.use('/api', itemsRouter);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});