import LocationForm from '../../LocationForm';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditDistrictPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await prisma.district.findUnique({ where: { id } });
  const regions = await prisma.region.findMany({ 
    include: { country: true },
    orderBy: { name: 'asc' }
  });
  if (!data) notFound();
  return <LocationForm type="district" initialData={data} regions={regions} />;
}