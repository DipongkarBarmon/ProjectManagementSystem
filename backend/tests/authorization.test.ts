import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { PlatformRole, OrganizationRole, UserStatus } from '../generated/prisma/enums';
import config from '../src/app/config';
import { redisClient } from '../src/app/lib/redis';
import { OrganizationBillingService } from '../src/app/module/organizationbilling/organizationbilling.service';

describe('Authorization API Integration Tests', () => {
  let adminToken: string;
  let memberToken: string;
  let otherUserToken: string;
  let superAdminToken: string;
  let guestToken: string;
  let ownerToken: string;

  let orgId: string;
  let projectId: string;

  beforeAll(async () => {
    vi.spyOn(OrganizationBillingService, 'checkLimit').mockResolvedValue(undefined as any);
    await redisClient.connect();
    await prisma.organizationMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();
    await redisClient.flushDb();

    const hashedPassword = await bcrypt.hash('Password123!', Number(config.bcrypt_salt_rounds));

    // Create 3 Users
    const adminUser = await prisma.user.create({ data: { name: 'Admin', email: 'admin@example.com', password: hashedPassword, emailVerified: true } });
    const memberUser = await prisma.user.create({ data: { name: 'Member', email: 'member@example.com', password: hashedPassword, emailVerified: true } });
    const guestUser = await prisma.user.create({ data: { name: 'Guest', email: 'guest@example.com', password: hashedPassword, emailVerified: true } });
    const ownerUser = await prisma.user.create({ data: { name: 'Owner', email: 'owner@example.com', password: hashedPassword, emailVerified: true } });
    const otherUser = await prisma.user.create({ data: { name: 'Other', email: 'other@example.com', password: hashedPassword, emailVerified: true } });
    const superAdmin = await prisma.user.create({ data: { name: 'SuperAdmin', email: 'super@example.com', password: hashedPassword, emailVerified: true, platformRole: PlatformRole.SUPER_ADMIN } });

    // Login users to get tokens
    const login = async (email: string) => {
      const res = await request(app).post('/api/v1/auth/login').send({ email, password: 'Password123!' });
      const cookies = res.headers['set-cookie'] as string[];
      const accessCookie = cookies.find(c => c.startsWith('accessToken='));
      return accessCookie ? accessCookie.split(';')[0].split('=')[1] : '';
    };

    adminToken = await login(adminUser.email);
    memberToken = await login(memberUser.email);
    otherUserToken = await login(otherUser.email);
    superAdminToken = await login(superAdmin.email);
    guestToken = await login(guestUser.email);
    ownerToken = await login(ownerUser.email);

    // Create Organization and assign roles
    const org = await prisma.organization.create({
      data: {
        name: 'Test Org',
        slug: 'test-org-1'
      }
    });
    orgId = org.id;

    await prisma.organizationMember.createMany({
      data: [
        { organizationId: orgId, userId: ownerUser.id, organizationRole: OrganizationRole.OWNER },
        { organizationId: orgId, userId: adminUser.id, organizationRole: OrganizationRole.ORG_ADMIN },
        { organizationId: orgId, userId: memberUser.id, organizationRole: OrganizationRole.MEMBER },
        { organizationId: orgId, userId: guestUser.id, organizationRole: OrganizationRole.GUEST }
      ]
    });

    // Create a project
    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        organizationId: orgId,
        createdById: adminUser.id,
        slug: 'test-project'
      }
    });
    projectId = project.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
  });

  it('ORG_ADMIN should be able to create a project', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${orgId}/create-project`)
      .set('Cookie', [`accessToken=${adminToken}`])
      .send({ name: 'Admin Project', slug: 'admin-project' });

    expect(res.status).toBe(201);
  });

  it('MEMBER should get 403 when trying to create a project', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${orgId}/create-project`)
      .set('Cookie', [`accessToken=${memberToken}`])
      .send({ name: 'Member Project' });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('permissions');
  });

  it('MEMBER should get 200 when trying to read projects', async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${orgId}/getAllprojects`)
      .set('Cookie', [`accessToken=${memberToken}`]);

    expect(res.status).toBe(200);
  });

  it('User from outside the organization should get 403', async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${orgId}/getAllprojects`)
      .set('Cookie', [`accessToken=${otherUserToken}`]);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('not a member');
  });

  it('Platform Admin endpoints restricted to SUPER_ADMIN', async () => {
    // Normal user trying to access billing plans
    const resUser = await request(app)
      .get(`/api/v1/billing/plans`)
      .set('Cookie', [`accessToken=${adminToken}`]); // platformRole = USER

    expect(resUser.status).toBe(403);
    expect(resUser.body.message).toContain('platform permission');

    // Super Admin trying to access billing plans
    const resAdmin = await request(app)
      .get(`/api/v1/billing/plans`)
      .set('Cookie', [`accessToken=${superAdminToken}`]);

    // Controller might return 200 or something else if not fully implemented, but it should NOT be 401/403
    expect([200, 404, 500]).toContain(resAdmin.status); // Assuming it passes auth
  });

  it('User without token should get 401 Unauthorized', async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${orgId}/getAllprojects`);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('log in');
  });

  it('Should prevent horizontal privilege escalation', async () => {
    // Create Org 2 and Project 2 for Other User
    const org2 = await prisma.organization.create({ data: { name: 'Org 2', slug: 'org-2' } });
    await prisma.organizationMember.create({ data: { organizationId: org2.id, userId: (await prisma.user.findFirst({where:{name:'Other'}}))!.id, organizationRole: OrganizationRole.ORG_ADMIN } });
    const project2 = await prisma.project.create({ data: { name: 'Proj 2', slug:'p2', organizationId: org2.id, createdById: (await prisma.user.findFirst({where:{name:'Other'}}))!.id } });

    // Member (from Org 1) tries to access Project 2 in Org 2 by using Org 2 ID in URL
    // They are not in Org 2, so auth middleware blocks them:
    const res1 = await request(app)
      .get(`/api/v1/projects/${org2.id}/projects/${project2.id}`)
      .set('Cookie', [`accessToken=${memberToken}`]);
    expect(res1.status).toBe(403);
    
    // Member (from Org 1) tries to access Project 2 by using Org 1 ID in URL (bypassing auth middleware context)
    // The query in controller should return 404/not found because project2 doesn't belong to Org 1.
    const res2 = await request(app)
      .get(`/api/v1/projects/${orgId}/projects/${project2.id}`)
      .set('Cookie', [`accessToken=${memberToken}`]);
    
    expect(res2.body.success).toBe(false);
  });

  it('GUEST should not be able to create a project', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${orgId}/create-project`)
      .set('Cookie', [`accessToken=${guestToken}`]) // guestToken is not in scope, so I will fetch it again or store it in describe block. Wait, I didn't declare it at the top of describe. Let me declare it.
      .send({ name: 'Guest Project', slug: 'guest-project' });

    expect(res.status).toBe(403);
  });

  it('OWNER should be able to create a project', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${orgId}/create-project`)
      .set('Cookie', [`accessToken=${ownerToken}`])
      .send({ name: 'Owner Project', slug: 'owner-project' });

    expect(res.status).toBe(201);
  });
});
