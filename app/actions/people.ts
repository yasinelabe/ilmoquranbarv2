'use server'

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// --- SCHEMAS ---

// Student Schema (Retained)
const StudentSchema = z.object({
    id: z.coerce.number().optional(),
    fullname: z.string().min(3),
    age: z.coerce.number().min(4).max(20),
    sex: z.enum(['Male', 'Female']),
    quranCircleId: z.coerce.number(),
    parentId: z.coerce.number().optional(),
});

// Teacher Schema (NEW)
const TeacherSchema = z.object({
    id: z.coerce.number().optional(),
    fullname: z.string().min(3, "Full name is required."),
    bio: z.string(),
    quranCircleId: z.coerce.number().min(1, "Circle assignment is required."),
    sex: z.enum(['Male', 'Female']),
});

// Helper type for form state
type FormState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
} | undefined;

// --- ACTIONS ---

// 1. STUDENT ACTIONS (Retained for completeness)
export async function saveStudentAction(prevState: any, formData: FormData) { /* [Immersive content redacted for brevity.] */ }

export async function deleteStudentAction(formData: FormData) { /* [Immersive content redacted for brevity.] */ }

// 2. TEACHER ACTIONS (NEW)
export async function saveTeacherAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const rawData = Object.fromEntries(formData.entries());
    const validate = TeacherSchema.safeParse(rawData);

    if (!validate.success) {
        return { success: false, message: "Validation failed.", errors: validate.error.flatten().fieldErrors };
    }

    const { id, ...data } = validate.data;
    const isUpdate = !!id;

    try {
        if (isUpdate) {
            await prisma.teacher.update({ where: { id }, data });
        } else {
            // Create teacher and automatically 
            await prisma.teacher.create({
                data: {
                    ...data,
                }
            });
        }
        revalidatePath('/admin/teachers');
        revalidatePath('/admin/mosques');
        return { success: true, message: `Teacher ${isUpdate ? 'updated' : 'created'} successfully.` };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database error saving teacher. Check mosque link.' };
    }
}

export async function deleteTeacherAction(formData: FormData): Promise<FormState> {
    const id = Number(formData.get('id'));
    try {
        // Note: Assumes cascade delete is configured in Prisma for related QuranCircle/Students
        await prisma.teacher.delete({ where: { id } });
        revalidatePath('/admin/teachers');
        return { success: true, message: 'Teacher and associated circle/students deleted.' };
    } catch (error) {
        return { success: false, message: 'Cannot delete teacher. Check database dependencies.' };
    }
}