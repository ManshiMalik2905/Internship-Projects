const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('./models/User');
const FormData = require('./models/FormData');

const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, 'secretkey');
      req.user = decoded;
      res.locals.user = decoded; 
    } catch (err) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/task6DB')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', authMiddleware, (req, res) => {
  res.render('index');
});

app.post('/submit', authMiddleware, async (req, res) => {
  const { firstName, lastName, email, phone, address, message } = req.body;
  const newForm = new FormData({ firstName, lastName, email, phone, address, message });
  await newForm.save();
  res.redirect('/result');
});

app.get('/result', authMiddleware, async (req, res) => {
  const data = await FormData.find();
  res.render('result', { data });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return res.send('❌ Invalid credentials');
  }

  const token = jwt.sign({ id: user._id, username: user.username }, 'secretkey', { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
