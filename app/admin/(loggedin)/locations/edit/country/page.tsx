import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import LocationForm from '../../LocationForm';

export default async function EditCountryPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await prisma.country.findUnique({ where: { id } });
  if (!data) notFound();
  return <LocationForm type="country" initialData={data} />;
}