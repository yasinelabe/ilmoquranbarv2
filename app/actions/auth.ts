'use server'

import { prisma } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
// In a real app, use bcrypt.compare. For this demo, simple check if generated via seed, or implement bcrypt.
import bcrypt from 'bcryptjs';

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !user.isActive) {
    return { error: 'Invalid credentials or inactive account' };
  }

  // NOTE: Ensure you seed your DB with hashed passwords
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return { error: 'Invalid credentials' };
  }

  await createSession({
    id: user.id,
    username: user.username,
    fullname: user.fullname,
  });
  redirect('/admin/dashboard');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/admin/login');
}