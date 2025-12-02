'use server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function createUserAction(formData: FormData) {
  const fullname = String(formData.get('fullname') ?? '');
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!fullname || !username || !password) {
    throw new Error('fullname, username and password required');
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { fullname, username, password: hash }
  });

  redirect('/admin/users');
}

export async function updateUserAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const fullname = String(formData.get('fullname') ?? '');
  const username = String(formData.get('username') ?? '');
  const password = formData.get('password') ? String(formData.get('password')) : undefined;
  const isActive = formData.get('isActive') !== null ? Boolean(formData.get('isActive') === 'true') : undefined;

  if (!id) throw new Error('Invalid id');

  const data: any = { fullname, username };
  if (password) data.password = await bcrypt.hash(password, 10);
  if (typeof isActive !== 'undefined') data.isActive = isActive;

  await prisma.user.update({ where: { id }, data });
  redirect('/admin/users');
}

export async function deleteUserAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Invalid id');
  await prisma.user.delete({ where: { id }});
  redirect('/admin/users');
}

export async function toggleUserActiveAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Invalid id');

  const u = await prisma.user.findUnique({ where: { id }});
  if (!u) throw new Error('User not found');

  await prisma.user.update({ where: { id }, data: { isActive: !u.isActive }});
  redirect('/admin/users');
}
