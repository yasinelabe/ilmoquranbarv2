import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Start seeding...');

  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {}, // do NOT force password reset every seed run
    create: {
      fullname: 'System Administrator',
      username: 'admin',
      password: hashedPassword,
      isActive: true,
    }
  });

  console.log(`Admin user ready: ${adminUser.username}`);
  console.log(`Default password: ${adminPassword}`);
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
