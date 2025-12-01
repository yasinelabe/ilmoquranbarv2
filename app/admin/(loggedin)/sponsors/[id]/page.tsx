import SponsorForm from '../SponsorForm';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function SponsorManagementPage({ params }: { params: { id: string } }) {
  const id = (await params).id;


  if (id === 'create') {
    return <SponsorForm/>;
  }

  const sponsorId = parseInt(id);
  
  // Fetch sponsor data for editing
  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
  });

  if (!sponsor) {
    notFound();
  }

  return <SponsorForm initialData={sponsor}/>;
}