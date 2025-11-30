import LocationForm from '../../LocationForm';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditRegionPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await prisma.region.findUnique({ where: { id } });
  const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });
  if (!data) notFound();
  return <LocationForm type="region" initialData={data} countries={countries} />;
}