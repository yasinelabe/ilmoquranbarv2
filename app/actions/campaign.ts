'use server';

import { CampaignSchema } from "./campaign/schema";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function createCampaignAction(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    targetAmount: formData.get("targetAmount"),
    studentId: formData.get("studentId"),
    quranCircleId: formData.get("quranCircleId"),
    description: formData.get("description"),
    image: formData.get("image"),
  };

  const parsed = CampaignSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(parsed.error.format());
    throw new Error("Invalid form submission");
  }

  const data = parsed.data;
  let imageUrl: string | null = null;

  const imageFile = data.image as File | null;

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(imageFile.name) || ".png";
    const fileName = `${randomUUID()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public/uploads/campaigns");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    await fs.promises.writeFile(path.join(uploadDir, fileName), buffer);
    imageUrl = `/uploads/campaigns/${fileName}`;
  }

  await prisma.campaign.create({
    data: {
      name: data.name,
      type: data.type,
      targetAmount: data.targetAmount,
      studentId: data.studentId ? Number(data.studentId) : undefined,
      quranCircleId: data.quranCircleId ? Number(data.quranCircleId) : undefined,
      description: data.description ?? '',
      image: imageUrl,
    },
  });

  redirect("/admin/campaigns");
}
