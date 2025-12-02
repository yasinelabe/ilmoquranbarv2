'use server'

import { prisma } from '@/lib/db';
import { FormState } from '@/lib/types';
import { SponsorSchema } from '@/schema/zodSchema';
import { revalidatePath } from 'next/cache';

export async function saveSponsorAction(prevState: FormState, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    // Handle empty parentId select
    if (rawData.parentId === '') delete rawData.parentId;

    const validate = SponsorSchema.safeParse(rawData);

    if (!validate.success) {
        return { success: false, message: "Check inputs", errors: validate.error.flatten().fieldErrors };
    }

    const { id, ...data } = validate.data;

    try {
        if (id) {
            await prisma.sponsor.update({ where: { id }, data });
        } else {
            await prisma.sponsor.create({ data });
        }
        revalidatePath('/admin/sponsors');
        return { success: true, message: `Sponsor saved successfully` };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Database error' };
    }
}

export async function deleteSponsorAction(formData: FormData) {
    const id = Number(formData.get('id'));
    try {
        await prisma.sponsor.delete({ where: { id } });
        revalidatePath('/admin/sponsors');
        return { success: true, message: 'Sponsor deleted' };
    } catch (e) {
        return { success: false, message: 'Error deleting Sponsor' };
    }
}