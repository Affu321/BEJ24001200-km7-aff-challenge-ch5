const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthControllers {
    static renderRegisterPage(req, res) {
        res.render('register');
    }

    static renderLoginPage(req, res) {
        res.render('loginPage');
    }

    static async handleRegister(req, res) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await prisma.users.findUnique({ where: { email } });
    
            if (existingUser) {
                req.flash('error', 'Email already registered');
                return res.redirect('/register');
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.users.create({
                data: { name, email, password: hashedPassword }
            });
    
            req.flash('success', 'Registration successful. Please log in.');
            res.redirect('/login');
        } catch (error) {
            req.flash('error', error.message);
            res.redirect('/register');
        }
    }

    static async handleLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma.users.findUnique({ where: { email } });
    
            if (!user || !bcrypt.compareSync(password, user.password)) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }
    
            // Generate JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    
            res.json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    

    static renderDashboardPage(req, res) {
        if (!req.session.user) {
            req.flash('error', 'Please log in to access the dashboard');
            return res.redirect('/login');
        }
        res.render('dashboard', { user: req.session.user });
    }

    static authenticate(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ message: 'Unauthorized' });

            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) return res.status(403).json({ message: 'Forbidden' });
                res.status(200).json({ message: 'Authenticated', user });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = AuthControllers;
