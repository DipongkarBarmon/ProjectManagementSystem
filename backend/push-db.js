import { execSync } from 'child_process';
try {
  const result = execSync('npx prisma db push', { cwd: '/home/dipongkar/Desktop/ProgramingHeroProject/ProjectManagementSystem/backend', stdio: 'inherit' });
  console.log("Success");
} catch (e) {
  console.log("Failed");
}
