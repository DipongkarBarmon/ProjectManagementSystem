import bcrypt from "bcryptjs";
import { PlatformRole } from "../../../generated/prisma/enums";
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

    const name = config.super_admin_name;
    const email = config.super_admin_email;
    const password = config.super_admin_password;

    if(!name || !email || !password) {
      throw new Error("Super Admin name, email and password must be provided in the environment variables"); 
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
    await prisma.user.delete({
        where : {
          email : config.super_admin_email,
        }
    })  
  }

}