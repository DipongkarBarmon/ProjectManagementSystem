import { prisma } from './backend/src/app/lib/prisma';

async function main() {
  const users = await prisma.user.findMany({ take: 5 });
  const orgs = await prisma.organization.findMany({ take: 5 });
  console.log("Users:", users.map(u => u.id));
  console.log("Orgs:", orgs.map(o => o.id));
}
main().catch(console.error).finally(() => prisma.$disconnect());
