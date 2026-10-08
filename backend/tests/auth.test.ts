import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { PlatformRole, UserStatus } from '../../generated/prisma/enums';
import config from '../src/app/config';
import { redisClient } from '../src/app/lib/redis';
import crypto from 'crypto';

// Mock cloudinary and nodemailer to prevent real network calls during tests
vi.mock('../src/app/lib/cloudinary', () => ({
  uploadToCloudinary: vi.fn().mockResolvedValue({ secure_url: 'http://example.com/avatar.jpg', public_id: 'avatar123' })
}));
vi.mock('../src/app/lib/nodemailer', () => ({
  transporter: {
    sendMail: vi.fn().mockResolvedValue(true)
  }
}));

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    // Clear the database before tests
    await redisClient.connect();
    await prisma.user.deleteMany();
    await redisClient.flushDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
  });

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!'
  };

  let accessToken: string;
  let refreshToken: string;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('otp');

    // Check redis for the OTP
    const registerData = await redisClient.get(`register-data:${testUser.email}`);
    expect(registerData).toBeDefined();
  });

  it('should verify email with valid OTP', async () => {
    // Simulate setting OTP in Redis
    const otp = '123456';
    await redisClient.set(`register-otp:${testUser.email}`, otp);
    
    const res = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ email: testUser.email, otp });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();

    // Verify it was saved to the DB
    const dbUser = await prisma.user.findUnique({ where: { email: testUser.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser?.emailVerified).toBe(true);
  });

  it('should login normally', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
    
    // Extract tokens from cookies for later tests
    const cookies = res.headers['set-cookie'] as string[];
    const accessCookie = cookies.find(c => c.startsWith('accessToken='));
    const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
    accessToken = accessCookie ? accessCookie.split(';')[0].split('=')[1] : '';
    refreshToken = refreshCookie ? refreshCookie.split(';')[0].split('=')[1] : '';
  });

  it('should get current user profile (/me)', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('should refresh token successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh-token')
      .set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should logout and clear cookies', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const cookies = res.headers['set-cookie'] as string[];
    const accessCookie = cookies.find(c => c.startsWith('accessToken='));
    expect(accessCookie).toContain('1970');
  });

  it('should block login if user is blocked', async () => {
    // Manually block the user
    await prisma.user.update({
      where: { email: testUser.email },
      data: { status: UserStatus.BLOCKED }
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).not.toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('should login as super-admin', async () => {
    // Create a super admin
    const adminEmail = 'admin@example.com';
    const hashedPassword = await bcrypt.hash('Admin123!', Number(config.bcrypt_salt_rounds));
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        emailVerified: true,
        platformRole: PlatformRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE
      }
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: adminEmail, password: 'Admin123!' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.platformRole).toBe(PlatformRole.SUPER_ADMIN);
  });
});
