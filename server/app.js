const express = require('express');
const app = express();
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply routes
// ... existing code ...

// Error handling middleware (should be after routes)
app.use(notFound);
app.use(errorHandler);

// ... existing code ... 