'use server'

import { FormState } from '@/lib/types';
import { ContactSchema } from '@/schema/zodSchema';
// Assuming we would store contact messages in the DB or send an email. 
// For now, we'll log and simulate success.
// import { prisma } from '@/lib/db'; 
// import { sendEmail } from '@/lib/email'; // Placeholder for actual email utility


export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
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