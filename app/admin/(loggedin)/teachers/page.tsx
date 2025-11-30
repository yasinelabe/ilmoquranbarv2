import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteTeacherAction } from '@/app/actions/people';
import { Aperture, Users, Map } from 'lucide-react';

export default async function TeacherListPage() {
  const teachers = await prisma.teacher.findMany({
    include: { 
        quranCircle: {
            include: {
                students: { select: { id: true } },
                mosque: {
                    include: { district: { include: { region: { select: { name: true } } } } }
                }
            }
        },
    },
    orderBy: { id: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-green dark:text-white">Teachers Management</h1>
        <Link 
          href="/admin/teachers/create" 
          className="bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-[#c9952f] transition-colors font-bold"
        >
          + Enroll Teacher
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-sm uppercase text-gray-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Sex</th>
              <th className="p-4">Assigned Circle</th>
              <th className="p-4">Location / Students</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="p-4 font-bold text-gray-700 dark:text-gray-200 flex items-center">
                    <Aperture size={18} className="mr-2 text-brand-green" />
                    {teacher.fullname}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                    {teacher.sex}
                </td>
                <td className="p-4 font-semibold text-brand-gold dark:text-brand-gold/80">
                    {teacher.quranCircle?.name || 'Unassigned'}
                    <span className="text-xs font-normal text-gray-500 block">
                        Capacity: {teacher.quranCircle?.capacity || 'N/A'}
                    </span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center text-xs text-gray-500">
                        <Map size={14} className="mr-1.5 opacity-70" />
                        {teacher.quranCircle?.mosque.name}, {teacher.quranCircle?.mosque.district.region.name}
                    </div>
                    <div className="flex items-center mt-1 font-semibold">
                        <Users size={14} className="mr-1.5 text-brand-green" />
                        {teacher.quranCircle?.students.length || 0} Students
                    </div>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <Link href={`/admin/teachers/${teacher.id}`} className="p-2 text-gray-400 hover:text-brand-green">
                    Edit
                  </Link>
                  <DeleteButton action={deleteTeacherAction} itemId={teacher.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}