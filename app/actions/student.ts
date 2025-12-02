'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { StudentSchema } from '@/schema/zodSchema';
import { FormState } from '@/lib/types';

export async function saveStudentAction(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  // Handle empty parentId select
  if (rawData.parentId === '') delete rawData.parentId;

  const validate = StudentSchema.safeParse(rawData);

  if (!validate.success) {
    return { success: false, message: "Check inputs", errors: validate.error.flatten().fieldErrors };
  }

  const { id, ...data } = validate.data;

  try {
    if (id) {
      await prisma.student.update({ where: { id }, data });
    } else {
      await prisma.student.create({ data });
    }
    revalidatePath('/admin/students');
    return { success: true, message: `Student saved successfully` };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Database error' };
  }
}

export async function deleteStudentAction(formData: FormData) {
  const id = Number(formData.get('id'));
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath('/admin/students');
    return { success: true, message: 'Student deleted' };
  } catch (e) {
    return { success: false, message: 'Error deleting student' };
  }
}