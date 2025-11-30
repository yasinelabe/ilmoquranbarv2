import LocationForm from '../../LocationForm';
import { prisma } from '@/lib/db';

export default async function CreateRegionPage() {
  const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });
  return <LocationForm type="region" countries={countries} />;
}