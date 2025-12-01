'use server'

import { z } from 'zod';
// Assuming we would store contact messages in the DB or send an email. 
// For now, we'll log and simulate success.
// import { prisma } from '@/lib/db'; 
// import { sendEmail } from '@/lib/email'; // Placeholder for actual email utility

const ContactSchema = z.object({
  fullname: z.string().min(3, "Full name is required."),
  email: z.email("A valid email address is required."),
  subject: z.string().min(5, "Subject is required."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormState = {
  success: boolean;
  message: string;
} | undefined;

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const rawData = {
    fullname: formData.get('fullname'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const validation = ContactSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    // Return the first validation error encountered
    return { success: false, message: errors.fullname?.[0] || errors.email?.[0] || errors.subject?.[0] || errors.message?.[0] || "Invalid submission data." };
  }

  // --- BUSINESS LOGIC: Send Email & Store in DB ---
  try {
    // 1. Log or Store Message (Simulation)
    console.log('Received Contact Message:', validation.data);

    // In a production app, you would integrate:
    // await prisma.contactMessage.create({ data: validation.data }); 
    // await sendEmail({ to: 'admin@ilmoquraanbar.com', subject: 'New Contact Form Submission', body: JSON.stringify(validation.data) });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return { success: true, message: "Thank you! Your message has been sent successfully." };

  } catch (error) {
    console.error('Contact form submission failed:', error);
    return { success: false, message: "A server error occurred. Please try again later." };
  }
}