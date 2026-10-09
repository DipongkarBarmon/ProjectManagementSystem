import { prisma } from './src/app/lib/prisma';
async function main() {
  const members = await prisma.organizationMember.findMany({ include: { user: true } });
  console.log(JSON.stringify(members, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
