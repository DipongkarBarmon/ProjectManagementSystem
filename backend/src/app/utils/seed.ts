import bcrypt from "bcryptjs";
import { OrganizationRole, PlatformRole } from "../../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma"

export const seedPlans = async () => {
   try {
    const existingPlans = await prisma.plan.findMany();
    if (existingPlans.length > 0) {
      console.log("Plans already exist. Skipping seeding.");
      return;
    }

       console.log('Start seeding...')

  // Seed FREE Plan
  const freePlan = await prisma.plan.upsert({
    where: { name: 'FREE' },
    update: {},
    create: {
      name: 'FREE',
      description: 'Free tier with basic limits',
      priceMonthly: 0,
      priceYearly: 0,
      maxMembers: 5,
      maxTeams: 2,
      maxProjects: 2,
      maxStorageBytes: 1073741824, // 1 GB
      isActive: true,
    },
  })
  console.log(`Created plan: ${freePlan.name}`)

  // Seed PRO Plan
  const proPlan = await prisma.plan.upsert({
    where: { name: 'PRO' },
    update: {},
    create: {
      name: 'PRO',
      description: 'Professional tier with higher limits',
      priceMonthly: 15, // e.g., 1500 BDT
      priceYearly: 150,
      maxMembers: 20,
      maxTeams: 10,
      maxProjects: 10,
      maxStorageBytes: 10737418240, // 10 GB
      isActive: true,
    },
  })
  console.log(`Created plan: ${proPlan.name}`)

  // Seed BUSINESS Plan
  const businessPlan = await prisma.plan.upsert({
    where: { name: 'BUSINESS' },
    update: {},
    create: {
      name: 'BUSINESS',
      description: 'Business tier with no limits',
      priceMonthly: 50, // e.g., 5000 BDT
      priceYearly: 500,
      maxMembers: null,
      maxTeams: null,
      maxProjects: null,
      maxStorageBytes: 53687091200, // 50 GB
      isActive: true,
    },
  })
  console.log(`Created plan: ${businessPlan.name}`)

  console.log('Seeding finished.')     
   }catch (error) {
    console.error('Error seeding plans:', error)
   }
}

export const seedSupperAdmin = async () => {
    const name = config.super_admin_name;
    const email = config.super_admin_email;
    const password = config.super_admin_password;

    if(!name || !email || !password) {
      console.log("Super Admin name, email and password must be provided in the environment variables. Skipping seeding."); 
      return;
    }
    
  try{
      const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        platformRole : PlatformRole.SUPER_ADMIN 
      }
    })

    if(isExistSuperAdmin){ 
      console.log("Super Admin already exists. Skipping seeding.");
      return;

    }
  
    const hashedPassword = await bcrypt.hash(password , Number(config.bcrypt_salt_rounds));


    const createSuperAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        platformRole: PlatformRole.SUPER_ADMIN,
        emailVerified: true,
        
      },
      omit: {
        password: true,
      },
    })

    console.log("Super Admin created successfully", createSuperAdmin);


  } catch (error) {
    console.log("Error while seeding super admin", error);
  }

}



export const seedOrgnizerAdmin = async () => {
    const name = config.super_organizer_name;
    const email = config.super_organizer_email;
    const password = config.super_organizer_password;

    if(!name || !email || !password) {
      console.log("Organizer admin name, email and password must be provided in the environment variables. Skipping seeding.");
      return;
    }

  try{
      const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
      const organizer = await prisma.user.upsert({
        where: { email },
        update: { name, emailVerified: true },
        create: {
          name,
          email,
          password: hashedPassword,
          platformRole: PlatformRole.USER,
          emailVerified: true,
        },
      });

      const organizationSlug = config.super_organizer_name!
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const organization = await prisma.organization.upsert({
        where: { slug: organizationSlug },
        update: { name: config.super_organizer_name! },
        create: {
          name: config.super_organizer_name!,
          slug: organizationSlug,
        },
      });

      await prisma.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: organizer.id,
          },
        },
        update: { organizationRole: OrganizationRole.OWNER },
        create: {
          organizationId: organization.id,
          userId: organizer.id,
          organizationRole: OrganizationRole.OWNER,
        },
      });

      const demoUsers = [
        { name: config.super_organizer_manager_name, email: config.super_organizer_manager_email, password: config.super_organizer_manager_password, role: OrganizationRole.PROJECT_MANAGER },
        { name: config.super_organizer_team_leader_name, email: config.super_organizer_team_leader_email, password: config.super_organizer_team_leader_password, role: OrganizationRole.TEAM_LEAD },
        { name: config.super_organizer_member_name, email: config.super_organizer_member_email, password: config.super_organizer_member_password, role: OrganizationRole.MEMBER },
      ];
      for (const demoUser of demoUsers) {
        if (!demoUser.name || !demoUser.email || !demoUser.password) continue;
        const user = await prisma.user.upsert({
          where: { email: demoUser.email },
          update: { name: demoUser.name, emailVerified: true },
          create: {
            name: demoUser.name,
            email: demoUser.email,
            password: await bcrypt.hash(demoUser.password, Number(config.bcrypt_salt_rounds)),
            platformRole: PlatformRole.USER,
            emailVerified: true,
          },
        });
        await prisma.organizationMember.upsert({
          where: { organizationId_userId: { organizationId: organization.id, userId: user.id } },
          update: { organizationRole: demoUser.role },
          create: { organizationId: organization.id, userId: user.id, organizationRole: demoUser.role },
        });
      }
      console.log("Organizer admin and demo members seeded successfully.");


  } catch (error) {
    console.log("Error while seeding organizer admin and demo members", error);
  }

}