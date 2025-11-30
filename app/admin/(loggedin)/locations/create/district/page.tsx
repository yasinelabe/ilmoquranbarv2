import LocationForm from '../../LocationForm';
import { prisma } from '@/lib/db';

export default async function CreateDistrictPage() {
  const regions = await prisma.region.findMany({ 
    include: { country: true },
    orderBy: { name: 'asc' }
  });
  return <LocationForm type="district" regions={regions} />;
}