const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');
const { generateOTP, validateOTP } = require('../utils/otp');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Пользователь уже существует' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    // Отправляем email с подтверждением регистрации
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://${process.env.ADRESS}:${process.env.PORT}/auth/verify/${token}`;
    await sendEmail(email, 'Подтвердите регистрацию', `
        Пожалуйста, подтвердите вашу регистрацию, нажав - ${verificationUrl}"
    `);
    res.status(201).json({ message: 'Пользователь зарегистрирован, пожалуйста, проверьте вашу почту для подтверждения' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации пользователя', error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    // Проверка подтверждения email
    if (!user.isVerified) return res.status(400).json({ message: 'Email не подтвержден' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при входе', error });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(400).json({ message: 'Недействительный токен' });
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email успешно подтвержден' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при подтверждении email', error });
  }
};

const verifyOTP = async (req, res) => {
  const { otp, userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(400).json({ message: 'Пользователь не найден' });

    const isValidOTP = validateOTP(otp, user.twoFactorSecret);
    if (!isValidOTP) return res.status(400).json({ message: 'Недействительный OTP' });

    res.status(200).json({ message: 'OTP успешно подтвержден' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при подтверждении OTP', error });
  }
};

module.exports = { register, login, verifyEmail, verifyOTP };