import { prisma } from '@/lib/db';
import Link from 'next/link';
import { MapPin, Globe, Landmark } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteCountryAction, deleteDistrictAction, deleteRegionAction } from '@/app/actions/locations';

export default async function LocationListPage() {
  const countries = await prisma.country.findMany({
    include: {
      regions: {
        include: {
          districts: {
            include: {
              mosques: {
                select: { id: true } 
              }
            },
            orderBy: { name: 'asc' }
          }
        },
        orderBy: { name: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-green dark:text-white">Location Management</h1>
      <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
        <Link href="/admin/locations/create/country" className="flex items-center bg-brand-green text-white px-4 py-2 rounded-xl hover:bg-brand-green/90 transition-colors">
          <Globe size={18} className="mr-2" /> Country
        </Link>
        <Link href="/admin/locations/create/region" className="flex items-center bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-brand-gold/90 transition-colors">
          <Landmark size={18} className="mr-2" /> Region
        </Link>
        <Link href="/admin/locations/create/district" className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors">
          <MapPin size={18} className="mr-2" /> District
        </Link>
      </div>

      {/* Hierarchy Display */}
      <div className="space-y-8">
        {countries.map((country) => (
          <div key={country.id} className="border-l-4 border-brand-green/50 pl-4 py-2">
            
            {/* Country Header */}
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-brand-green flex items-center">
                <Globe size={20} className="mr-2" /> {country.name}
              </h2>
              <div className="flex gap-2">
                <Link href={`/admin/locations/edit/country/${country.id}`} className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-full">Edit</Link>
                <DeleteButton action={deleteCountryAction} itemId={country.id} />
              </div>
            </div>

            {/* Regions List */}
            <div className="ml-6 mt-4 space-y-4">
              {country.regions.map((region) => (
                <div key={region.id} className="border-l-2 border-brand-gold/50 pl-4 py-2">
                  
                  {/* Region Header */}
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <h3 className="text-lg font-semibold text-brand-gold flex items-center">
                      <Landmark size={18} className="mr-2" /> {region.name}
                    </h3>
                    <div className="flex gap-2">
                      <Link href={`/admin/locations/edit/region/${region.id}`} className="p-1 text-gray-500 hover:text-brand-green">Edit</Link>
                      <DeleteButton action={deleteRegionAction} itemId={region.id} />
                    </div>
                  </div>

                  {/* Districts List */}
                  <div className="ml-4 mt-2 space-y-2">
                    {region.districts.map((district) => (
                      <div key={district.id} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-gray-800/70 rounded-md border border-gray-100 dark:border-gray-700">
                        <span className="flex items-center text-gray-700 dark:text-gray-300">
                          <MapPin size={16} className="mr-2 text-gray-400" />
                          {district.name}
                          <span className="ml-3 text-xs font-medium text-gray-500 dark:text-gray-500">
                            ({district.mosques.length} Mosques)
                          </span>
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/admin/locations/edit/district/${district.id}`} className="p-1 text-gray-400 hover:text-brand-gold">Edit</Link>
                          <DeleteButton action={deleteDistrictAction} itemId={district.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}