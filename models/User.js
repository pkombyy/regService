const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('book_collection_db', 'postgres', '123Qwe123', {
  host: 'localhost',
  dialect: 'postgres'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isVerified: { // Добавлено поле для проверки email
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  twoFactorSecret: { // Поле для хранения секретного ключа 2FA
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true // Включить поля createdAt и updatedAt
});

module.exports = User;
