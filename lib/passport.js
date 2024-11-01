const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const authenticate = async (email, password, done) => {
    try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (user && bcrypt.compareSync(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid email or password' });
        }
    } catch (error) {
        return done(error);
    }
};

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticate));

module.exports = passport;
