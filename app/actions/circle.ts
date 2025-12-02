'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { QuranCircleSchema } from '@/schema/zodSchema';
import { FormState } from '@/lib/types';


export async function saveQuranCircleAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validate = QuranCircleSchema.safeParse(rawData);

  if (!validate.success) {
    return { success: false, message: "Validation failed.", errors: validate.error.flatten().fieldErrors };
  }

  const { id, ...data } = validate.data;
  const isUpdate = !!id;

  try {
    if (isUpdate) {
      await prisma.quranCircle.update({ where: { id }, data });
    } else {
      await prisma.quranCircle.create({ data });
    }
    revalidatePath('/admin/circles');
    revalidatePath('/admin/teachers'); 
    revalidatePath('/admin/students'); 
    return { success: true, message: `Quran Circle ${isUpdate ? 'updated' : 'created'} successfully.` };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Database error saving Quran Circle. Check Mosque link.' };
  }
}

export async function deleteQuranCircleAction(formData: FormData): Promise<FormState> {
  const id = Number(formData.get('id'));
  try {
    await prisma.quranCircle.delete({ where: { id } });
    revalidatePath('/admin/circles');
    revalidatePath('/admin/teachers'); 
    revalidatePath('/admin/students'); 
    return { success: true, message: 'Quran Circle deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Cannot delete Quran Circle. It may have assigned students or teachers.' };
  }
}