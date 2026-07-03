const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./Models/db'); 

const AuthRouter = require('./Routes/AuthRouter');
const AdminRouter = require('./Routes/AdminRouter');
const TeacherRouter = require('./Routes/TeacherRouter');
const ParentRouter = require('./Routes/ParentRouter');



const app = express();

// Health check
app.get('/ping', (req, res) => {
  res.send('PONG');
});


// Middleware
app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', AuthRouter);
app.use('/admin', AdminRouter); 
app.use('/teacher', TeacherRouter);
app.use('/parent', ParentRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start server & socket

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });
