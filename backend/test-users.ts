import { prisma } from './src/app/lib/prisma';
async function main() {
  const users = await prisma.user.findMany({
    where: {
      id: { in: ["2229bbee-a47d-48dc-ae35-73b4495b26af", "1db64b76-2031-4103-8c37-66db181d150f"] }
    }
  });
  console.log("Found users:", users.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
