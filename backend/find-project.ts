import { prisma } from './src/app/lib/prisma';
async function main() {
  const project = await prisma.project.findFirst({
    where: { name: "Task Management System" }
  });
  console.log("Project:", project);
  
  const org = await prisma.organization.findFirst({
    where: { name: "abc limited" }
  });
  console.log("Org:", org);
}
main().catch(console.error).finally(() => prisma.$disconnect());
