import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Start seeding...');

  // --- 1. Seed Default Admin User ---
  console.log('Seeding Admin User...');
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
  
  // --- 2. Seed Email Templates ---
  console.log('Seeding Email Templates...');

  const templates = [
    {
      name: 'Student Sponsorship Update',
      subject: 'A Thank You Note from [[STUDENT_NAME]] and Our Team',
      body: `Dear [[SPONSOR_NAME]],

We are delighted to share a special update on the student you are sponsoring, **[[STUDENT_NAME]]**, through the **[[CAMPAIGN_NAME]]** campaign.

Your commitment is making a profound difference in their education and future. They are progressing well in their Quranic studies.

Thank you once again for your incredible generosity.

Sincerely,
The Quran Circle Management Team`,
      isDefault: true,
    },
    {
      name: 'Quran Circle Sponsorship Update',
      subject: 'Impact Report: Your Support for [[CIRCLE_NAME]]',
      body: `Dear [[SPONSOR_NAME]],

We want to sincerely thank you for your generous support of the **[[CAMPAIGN_NAME]]** campaign, which is dedicated to the **[[CIRCLE_NAME]]** circle.

Your contribution helps us maintain a vibrant learning environment for all students.

The students currently in this circle are:
[[STUDENTS_LIST]]

Your generosity fuels their journey!

Best regards,
The Quran Circle Management Team`,
      isDefault: false,
    }
  ];

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: { 
        subject: template.subject, 
        body: template.body 
      },
      create: template,
    });
    console.log(`Template seeded: ${template.name}`);
  }

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