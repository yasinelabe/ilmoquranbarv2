'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { FormState } from '@/lib/types';
import { CountrySchema, DistrictSchema, RegionSchema } from '@/schema/zodSchema';

// 1. Country CRUD
export async function saveCountryAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validate = CountrySchema.safeParse(rawData);

  if (!validate.success) { return { success: false, message: "Validation failed.", errors: validate.error.flatten().fieldErrors }; }

  const { id, ...data } = validate.data;
  const isUpdate = !!id;

  try {
    if (isUpdate) { await prisma.country.update({ where: { id }, data }); } 
    else { await prisma.country.create({ data }); }
    revalidatePath('/admin/locations');
    return { success: true, message: `Country ${isUpdate ? 'updated' : 'created'} successfully.` };
  } catch (error) {
    return { success: false, message: "Database error saving country." };
  }
}

export async function deleteCountryAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  const id = Number(formData.get('id'));
  try {
    await prisma.country.delete({ where: { id } });
    revalidatePath('/admin/locations');
    return { success: true, message: "Country deleted." };
  } catch (error) {
    return { success: false, message: "Cannot delete country (has associated regions or data)." };
  }
}

// 2. Region CRUD (similar pattern applied)
export async function saveRegionAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validate = RegionSchema.safeParse(rawData);

  if (!validate.success) { return { success: false, message: "Validation failed.", errors: validate.error.flatten().fieldErrors }; }

  const { id, countryId, ...data } = validate.data;
  const isUpdate = !!id;

  try {
    if (isUpdate) { await prisma.region.update({ where: { id }, data: { ...data, countryId } }); } 
    else { await prisma.region.create({ data: { ...data, countryId } }); }
    revalidatePath('/admin/locations');
    return { success: true, message: `Region ${isUpdate ? 'updated' : 'created'} successfully.` };
  } catch (error) {
    return { success: false, message: "Database error saving region." };
  }
}

export async function deleteRegionAction(formData: FormData): Promise<{ success: boolean; message: string }>  {
  const id = Number(formData.get('id'));
  try {
    await prisma.region.delete({ where: { id } });
    revalidatePath('/admin/locations');
    return { success: true, message: "Region deleted." };
  } catch (error) {
    return { success: false, message: "Cannot delete region (has associated districts or data)." };
  }
}

// 3. District CRUD (similar pattern applied)
export async function saveDistrictAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validate = DistrictSchema.safeParse(rawData);

  if (!validate.success) { return { success: false, message: "Validation failed.", errors: validate.error.flatten().fieldErrors }; }

  const { id, regionId, ...data } = validate.data;
  const isUpdate = !!id;

  try {
    if (isUpdate) { await prisma.district.update({ where: { id }, data: { ...data, regionId } }); } 
    else { await prisma.district.create({ data: { ...data, regionId } }); }
    revalidatePath('/admin/locations');
    return { success: true, message: `District ${isUpdate ? 'updated' : 'created'} successfully.` };
  } catch (error) {
    return { success: false, message: "Database error saving district." };
  }
}

export async function deleteDistrictAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  const id = Number(formData.get('id'));
  try {
    await prisma.district.delete({ where: { id } });
    revalidatePath('/admin/locations');
    return { success: true, message: "District deleted." };
  } catch (error) {
    return { success: false, message: "Cannot delete district (has associated mosques or data)." };
  }
}