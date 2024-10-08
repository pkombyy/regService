require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

// Защищённый маршрут
app.get('/protected', authMiddleware, (req, res) => {
  res.send('Access granted to protected route');
});

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Сервер запущен на порту ${process.env.PORT}`);
});
}).catch(err => {
    console.error('Не удалось подключиться к базе данных:', err);
});

