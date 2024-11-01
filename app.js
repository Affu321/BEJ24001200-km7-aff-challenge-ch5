const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('./lib/passport');
const router = require('./routes');
require('dotenv').config();
const swaggerSetup = require('./swagger'); // Import swagger setup

const app = express(); // Inisialisasi app

const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_default_session_secret',
    resave: false,
    saveUninitialized: true
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Swagger setup (pindahkan di sini setelah app diinisialisasi)
swaggerSetup(app);

// Routes
app.use('/', router);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
