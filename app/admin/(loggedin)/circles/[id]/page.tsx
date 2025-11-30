import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import CircleForm from '../CircleForm';

export default async function QuranCircleManagementPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  
  // Fetch data for dropdowns: Mosques (needed for assignment)
  const mosques = await prisma.mosque.findMany({ 
    include: { 
        district: { 
            include: { 
                region: { 
                    select: { name: true } 
                } 
            } 
        } 
    },
    orderBy: { name: 'asc' }
  });

  if (id === 'create') {
    return <CircleForm mosques={mosques} />;
  }

  const circleId = parseInt(id);
  
  // Handle invalid numeric ID
  if (isNaN(circleId)) {
    notFound();
  }

  // Fetch circle data for editing, including related entities
  const circle = await prisma.quranCircle.findUnique({
    where: { id: circleId },
  });

  if (!circle) {
    notFound();
  }

  return <CircleForm initialData={circle} mosques={mosques} />;
}