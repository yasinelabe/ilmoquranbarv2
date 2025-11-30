import MosqueForm from '../MosqueForm';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditMosquePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const mosque = await prisma.mosque.findUnique({
    where: { id },
  });

  if (!mosque) {
    notFound();
  }

  const districts = await prisma.district.findMany({ 
    include: { region: { include: { country: true } } },
    orderBy: [{ region: { country: { name: 'asc' } } }, { name: 'asc' }]
  });

  return <MosqueForm initialData={mosque} districts={districts} />;
}