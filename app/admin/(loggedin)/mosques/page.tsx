import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteMosqueAction } from '@/app/actions/mosque';
import { MapPin } from 'lucide-react';

export default async function MosqueListPage() {
  const mosques = await prisma.mosque.findMany({
    include: { district: { include: { region: true } } },
    orderBy: { id: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-green dark:text-white">Mosques</h1>
        <Link 
          href="/admin/mosques/create" 
          className="bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-[#c9952f] transition-colors font-bold"
        >
          + Add Mosque
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mosques.map((mosque) => (
          <div key={mosque.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{mosque.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <MapPin size={14} className="mr-1" />
                  {mosque.district.name}, {mosque.district.region.name}
                </p>
                {mosque.imam && (
                  <p className="text-xs text-brand-gold mt-2 font-medium">Imam: {mosque.imam}</p>
                )}
              </div>
              <DeleteButton action={deleteMosqueAction} itemId={mosque.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}