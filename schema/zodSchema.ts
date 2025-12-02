
import { imageMimeTypes, isFile } from '@/lib/constants';
import { z } from 'zod';

export const QuranCircleSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(3, "Name is required."),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
    mosqueId: z.coerce.number().min(1, "Mosque assignment is required."),
});

export const ContactSchema = z.object({
    fullname: z.string().min(3, "Full name is required."),
    email: z.email("A valid email address is required."),
    subject: z.string().min(5, "Subject is required."),
    message: z.string().min(10, "Message must be at least 10 characters."),
});


export const DonationSchema = z.object({
    campaignId: z.number(),
    amount: z.number().min(0.1),
    fullname: z.string().min(3),
    phone: z.string().min(9),
});

export const CountrySchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(3, "Country name is required."),
});

export const RegionSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(3, "Region name is required."),
    countryId: z.coerce.number({ error: "Country ID is required." }),
});

export const DistrictSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(3, "District name is required."),
    regionId: z.coerce.number({ error: "Region ID is required." }),
});

export const MosqueSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3),
  imam: z.string().optional(),
  districtId: z.coerce.number(),
});

export const TeacherSchema = z.object({
    id: z.coerce.number().optional(),
    fullname: z.string().min(3, "Full name is required."),
    bio: z.string(),
    quranCircleId: z.coerce.number().min(1, "Circle assignment is required."),
    sex: z.enum(['Male', 'Female']),
});


export const StudentSchema = z.object({
  id: z.coerce.number().optional(),
  fullname: z.string().min(3),
  age: z.coerce.number().min(4).max(20),
  sex: z.enum(['Male', 'Female']),
  quranCircleId: z.coerce.number(),
  parentId: z.coerce.number().optional(),
});

export const SponsorSchema = z.object({
    id: z.coerce.number().optional(),
    fullname: z.string().min(3),
    email: z.email("A valid email address is required."),
    phone: z.string().min(7)
});

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