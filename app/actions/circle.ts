'use server'

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Helper type for form state
type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
} | undefined;

// --- QURAN CIRCLE SCHEMAS ---

const QuranCircleSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3, "Name is required."),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
  mosqueId: z.coerce.number().min(1, "Mosque assignment is required."),
});

// --- QURAN CIRCLE ACTIONS ---

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
    revalidatePath('/admin/structure/circles');
    // Revalidate teacher/student pages as circle assignments may change
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
    revalidatePath('/admin/structure/circles');
    revalidatePath('/admin/teachers'); 
    revalidatePath('/admin/students'); 
    return { success: true, message: 'Quran Circle deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Cannot delete Quran Circle. It may have assigned students or teachers.' };
  }
}