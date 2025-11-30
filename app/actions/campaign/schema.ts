// app/actions/campaign/schema.ts
import { z } from "zod";

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

export const CampaignSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  targetAmount: z.string().min(1),
  studentId: z.string().optional().nullable(),
  quranCircleId: z.string().optional().nullable(),
  description: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine((file) => !file || (isFile(file) && file.size > 0), "Empty file")
    .refine(
      (file) =>
        !file || (isFile(file) && imageMimeTypes.includes(file.type)),
      "Invalid image type"
    ),
});
