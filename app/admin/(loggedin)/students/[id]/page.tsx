import StudentForm from '../StudentForm';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function StudentManagementPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  
  // Fetch data for dropdowns: Circles and Parents
  const quranCircles = await prisma.quranCircle.findMany({ 
    include: { 
        mosque: { select: { name: true } }, 
        students: { select: { id: true } } // Include students count for display
    },
    orderBy: { name: 'asc' }
  });

  const parents = await prisma.parent.findMany({
    orderBy: { fullname: 'asc' }
  });

  if (id === 'create') {
    return <StudentForm quranCircles={quranCircles} parents={parents} />;
  }

  const studentId = parseInt(id);
  
  // Fetch student data for editing
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    notFound();
  }

  return <StudentForm initialData={student} quranCircles={quranCircles} parents={parents} />;
}