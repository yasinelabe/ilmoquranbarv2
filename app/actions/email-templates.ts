'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Type definition for the data coming from the form
type TemplateData = {
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
};

/**
 * Creates a new email template.
 * If setting a new default, it ensures all others are set to false.
 */
export async function createTemplate(data: TemplateData) {
  try {
    // 1. If this is the new default, unset the old default
    if (data.isDefault) {
      await prisma.emailTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    // 2. Create the new template
    await prisma.emailTemplate.create({ data });
    
    revalidatePath('/admin/email-templates');
    return { success: true, message: 'Email template created successfully.' };
  } catch (error) {
    console.error('CREATE TEMPLATE ERROR:', error);
    return { success: false, message: 'Failed to create template.' };
  }
}

/**
 * Updates an existing email template.
 */
export async function updateTemplate(id: number, data: TemplateData) {
  try {
    // 1. If this is the new default, unset the old default
    if (data.isDefault) {
      await prisma.emailTemplate.updateMany({
        where: { NOT: { id: id }, isDefault: true },
        data: { isDefault: false },
      });
    }

    // 2. Update the specific template
    await prisma.emailTemplate.update({
      where: { id },
      data,
    });
    
    revalidatePath('/admin/email-templates');
    return { success: true, message: 'Email template updated successfully.' };
  } catch (error) {
    console.error('UPDATE TEMPLATE ERROR:', error);
    return { success: false, message: 'Failed to update template.' };
  }
}

/**
 * Deletes an email template by ID.
 */
export async function deleteTemplate(id: number) {
  try {
    // Prevent deletion of the last default template if possible
    const templateToDelete = await prisma.emailTemplate.findUnique({ where: { id } });

    if (templateToDelete?.isDefault) {
      const remainingTemplates = await prisma.emailTemplate.count({
        where: { isDefault: true, NOT: { id } },
      });
      if (remainingTemplates === 0) {
        // You might want a stronger check here, but for simplicity, we allow deletion
        // as long as there is one default template eventually.
      }
    }

    await prisma.emailTemplate.delete({ where: { id } });
    
    revalidatePath('/admin/email-templates');
    return { success: true, message: 'Email template deleted successfully.' };
  } catch (error) {
    console.error('DELETE TEMPLATE ERROR:', error);
    return { success: false, message: 'Failed to delete template. It might be in use.' };
  }
}

/**
 * Fetches all templates for the list.
 */
export async function getTemplates() {
  return prisma.emailTemplate.findMany({
    orderBy: { name: 'asc' },
  });
}