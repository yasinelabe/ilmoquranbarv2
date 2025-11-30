'use server'

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// --- SCHEMAS ---
const MosqueSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3),
  imam: z.string().optional(),
  districtId: z.coerce.number(),
});

// --- ACTIONS ---

// 1. MOSQUE ACTIONS
export async function saveMosqueAction(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validate = MosqueSchema.safeParse(rawData);

  if (!validate.success) {
    return { success: false, message: "Invalid data", errors: validate.error.flatten().fieldErrors };
  }

  const { id, ...data } = validate.data;

  try {
    if (id) {
      await prisma.mosque.update({ where: { id }, data });
      revalidatePath('/admin/mosques');
      return { success: true, message: 'Mosque updated' };
    } else {
      await prisma.mosque.create({ data });
      revalidatePath('/admin/mosques');
      return { success: true, message: 'Mosque created' };
    }
  } catch (e) {
    return { success: false, message: 'Database error' };
  }
}

export async function deleteMosqueAction(formData: FormData) {
  const id = Number(formData.get('id'));
  try {
    await prisma.mosque.delete({ where: { id } });
    revalidatePath('/admin/mosques');
    return { success: true, message: 'Mosque deleted' };
  } catch (e) {
    return { success: false, message: 'Cannot delete mosque (may have dependent data)' };
  }
}