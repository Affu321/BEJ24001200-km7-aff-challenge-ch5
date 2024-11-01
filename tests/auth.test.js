const request = require('supertest');
const app = require('../app'); // Pastikan path-nya benar ke file utama express Anda
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Auth API Integration Tests', () => {
    let token;

    beforeAll(async () => {
        await prisma.users.create({
            data: { name: 'Test User', email: 'test@example.com', password: await bcrypt.hash('password123', 10) }
        });
    });

    afterAll(async () => {
        await prisma.users.deleteMany(); // Hapus data setelah pengujian
        await prisma.$disconnect();
    });

    test('should register a new user', async () => {
        const res = await request(app).post('/register').send({
            name: 'New User',
            email: 'newuser@example.com',
            password: 'newpassword123'
        });
        expect(res.statusCode).toEqual(302); // Redirect after success
    });

    test('should not register a user with existing email', async () => {
        const res = await request(app).post('/register').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(302);
    });

    test('should login with valid credentials', async () => {
        const res = await request(app).post('/login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    test('should not login with invalid password', async () => {
        const res = await request(app).post('/login').send({
            email: 'test@example.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(302);
    });

    test('should authenticate with valid JWT token', async () => {
        const res = await request(app).get('/auth/authenticate')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Authenticated');
    });

    test('should not authenticate with invalid JWT token', async () => {
        const res = await request(app).get('/auth/authenticate')
            .set('Authorization', `Bearer invalidtoken`);
        expect(res.statusCode).toEqual(403);
    });
});
