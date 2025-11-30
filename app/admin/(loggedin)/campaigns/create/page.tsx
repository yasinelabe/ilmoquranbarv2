import CampaignForm from '@/components/admin/CampaignForm';
import { prisma } from '@/lib/db';

export default async function CreateCampaignPage() {
  const [circles, students] = await Promise.all([
    prisma.quranCircle.findMany(),
    prisma.student.findMany()
  ]);

  return (
    <div className="ml-64 p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">New Campaign</h1>

      <CampaignForm students={students} circles={circles} />
    </div>
  );
}
