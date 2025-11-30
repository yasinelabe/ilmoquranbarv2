import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { BookOpen, MapPin, Users, Calendar } from 'lucide-react';
import { deleteQuranCircleAction } from '@/app/actions/circle';

export default async function QuranCircleListPage() {
  const circles = await prisma.quranCircle.findMany({
    include: {
      mosque: {
        select: {
          name: true,
          district: {
            select: {
              region: { select: { name: true } }
            }
          }
        }
      },
      students: { select: { id: true } },
      teachers: { select: { id: true, fullname: true, quranCircleId: true } }
    },
    orderBy: { id: 'desc' }
  });

  const circlesWithAssignedTeacher = circles.map(circle => ({
    ...circle,
    assignedTeacher: circle.teachers.find(t => t.quranCircleId === circle.id) || null
  }));


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-green dark:text-white">Quran Circle Management</h1>
        <Link
          href="/admin/circles/create"
          className="bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-[#c9952f] transition-colors font-bold"
        >
          + Create New Circle
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-sm uppercase text-gray-500">
            <tr>
              <th className="p-4">Circle Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Enrollment</th>
              <th className="p-4">Schedule / Teacher</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {circlesWithAssignedTeacher.map((circle) => {
              const enrollment = circle.students.length;
              const capacity = circle.capacity;
              const capacityText = `${enrollment}/${capacity}`;
              const isFull = enrollment >= capacity;

              return (
                <tr key={circle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-200 flex items-center">
                    <BookOpen size={18} className="mr-2 text-brand-green" />
                    {circle.name}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1.5 opacity-70 text-brand-gold" />
                      {circle.mosque.name}
                    </div>
                    <span className="text-xs text-gray-500 block ml-5">
                      Region: {circle.mosque.district.region.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`font-semibold flex items-center ${isFull ? 'text-red-500' : 'text-blue-500'}`}>
                      <Users size={14} className="mr-1.5" />
                      {capacityText}
                    </div>
                    <span className="text-xs text-gray-500">
                      {isFull ? 'Circle is full' : `${capacity - enrollment} slots left`}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    <span className="text-xs font-semibold text-brand-green block">
                      Teacher: {circle.assignedTeacher?.fullname || 'Unassigned'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link href={`/admin/circles/${circle.id}`} className="p-2 text-gray-400 hover:text-brand-green">
                      Edit
                    </Link>
                    <DeleteButton action={deleteQuranCircleAction} itemId={circle.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}