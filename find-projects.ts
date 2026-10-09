import { prisma } from './src/app/lib/prisma';
async function main() {
  const projects = await prisma.project.findMany();
  console.log("Projects:", projects);
}
main().catch(console.error).finally(() => prisma.$disconnect());
