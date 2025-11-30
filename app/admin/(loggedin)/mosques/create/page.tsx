import { prisma } from '@/lib/db';
import MosqueForm from '../MosqueForm';

export default async function CreateMosquePage() {
  const districts = await prisma.district.findMany({ 
    include: { region: { include: { country: true } } },
    orderBy: [{ region: { country: { name: 'asc' } } }, { name: 'asc' }]
  });

  return <MosqueForm districts={districts} />;
}