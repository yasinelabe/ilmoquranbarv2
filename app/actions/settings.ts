"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/auth";

export async function updateProfileAction(formData: FormData) {
  const user = await getAuthUser();
  if (!user) return;

  const fullname = formData.get("fullname") as string;
  const username = formData.get("username") as string;

  await prisma.user.update({
    where: { id: user.id },
    data: { fullname, username },
  });

  revalidatePath("/admin/settings");
}

export async function changePasswordAction(formData: FormData) {
  const user = await getAuthUser();
  if (!user) return;

  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) return;

  const isValid = await bcrypt.compare(oldPassword, dbUser.password);
  if (!isValid) {
    throw new Error("Old password is incorrect.");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  revalidatePath("/admin/settings");
}
