import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteStudentAction } from '@/app/actions/student';
import { User } from 'lucide-react';

export default async function StudentListPage() {
  const students = await prisma.student.findMany({
    include: { quranCircle: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-green dark:text-white">Students</h1>

        <Link 
          href="/admin/students/create" 
          className="bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-[#c9952f] transition-colors font-bold"
        >
          + Add Student
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-sm uppercase text-gray-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Age / Sex</th>
              <th className="p-4">Quran Circle</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="p-4 font-bold text-gray-700 dark:text-gray-200">{student.fullname}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {student.age} yrs <span className="text-xs opacity-50">({student.sex})</span>
                </td>
                <td className="p-4 text-brand-green dark:text-brand-gold">{student.quranCircle.name}</td>
                <td className="p-4 flex justify-end gap-2">
                  <Link href={`/admin/students/${student.id}`} className="p-2 text-gray-400 hover:text-brand-green">
                    Edit
                  </Link>
                  <DeleteButton action={deleteStudentAction} itemId={student.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}