import TeacherForm from '../TeacherForm';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function TeacherManagementPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    if (!id) notFound();

    // Fetch all Quran Circles for the dropdown
    const quranCircles = await prisma.quranCircle.findMany({
        include: { mosque: { select: { name: true } } },
        orderBy: { name: 'asc' }
    });

    if (id === 'create') {
        return <TeacherForm quranCircles={quranCircles} />;
    }

    const teacherId = parseInt(id);
    if (isNaN(teacherId)) notFound();

    // Fetch teacher data for editing
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });

    if (!teacher) notFound();

    return <TeacherForm initialData={teacher} quranCircles={quranCircles} />;
}
