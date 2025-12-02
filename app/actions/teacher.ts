'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { TeacherSchema } from '@/schema/zodSchema';
import { FormState } from '@/lib/types';

// 2. TEACHER ACTIONS
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