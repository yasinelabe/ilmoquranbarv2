import nodemailer from 'nodemailer';
import { Campaign, QuranCircle, Sponsor, Student } from "@/prisma/generated";

// Define the shape of the dynamic data
export interface DynamicData {
  sponsor: Pick<Sponsor, 'fullname' | 'email'>;
  campaign: Pick<Campaign, 'name' | 'type'>;
  circle?: Pick<QuranCircle, 'name'> & { students: Pick<Student, 'fullname'>[] };
  student?: Pick<Student, 'fullname'>;
}

const EMAIL_PLACEHOLDERS: Record<string, keyof DynamicData | string> = {
    '[[SPONSOR_NAME]]': 'sponsor.fullname',
    '[[CAMPAIGN_NAME]]': 'campaign.name',
    '[[CIRCLE_NAME]]': 'circle.name',
    '[[STUDENT_NAME]]': 'student.fullname',
    '[[STUDENTS_LIST]]': 'circle.students', // Special case
};

export function parseEmailBody(templateBody: string, data: DynamicData): string {
  let parsedBody = templateBody;

  for (const [placeholder, dataKey] of Object.entries(EMAIL_PLACEHOLDERS)) {
    if (typeof dataKey === 'string' && dataKey.includes('.')) {
      const [model, field] = dataKey.split('.') as ['sponsor' | 'campaign' | 'circle' | 'student', string];
      const value = data[model]?.[field as keyof (typeof data)[typeof model]];
      
      // Basic replacement for scalar values
      if (value) {
        parsedBody = parsedBody.replace(new RegExp(placeholder, 'g'), String(value));
      } else {
        // Remove placeholder if data is not available (e.g., student name in a circle campaign)
        parsedBody = parsedBody.replace(new RegExp(placeholder, 'g'), '');
      }
    } else if (placeholder === '[[STUDENTS_LIST]]' && data.circle?.students) {
        // Special handling for the list of students
        const studentsList = data.circle.students.map(s => `- ${s.fullname}`).join('\n');
        parsedBody = parsedBody.replace(new RegExp(placeholder, 'g'), `\nStudents in this circle:\n${studentsList}`);
    }
  }
  return parsedBody;
}


// Configuration for your VPS SMTP server (load from environment variables)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'), // Use 465 for SMTPS or 587 for TLS/STARTTLS
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your mail server user (e.g., email address)
        pass: process.env.SMTP_PASS, // Your mail server password
    },
    // Optional: Add logging for debugging
    logger: true,
    debug: true,
});

/**
 * Sends a single email using the configured SMTP transporter.
 * @param toEmail The recipient's email address.
 * @param subject The subject line of the email.
 * @param htmlContent The HTML body of the email.
 * @returns An object indicating the success status.
 */
export async function sendSingleEmail(
    toEmail: string,
    subject: string,
    htmlContent: string
) {
    const senderEmail = process.env.EMAIL_FROM || 'no-reply@yourdomain.com';

    try {
        console.log(`Attempting to send email to: ${toEmail} with subject: ${subject}`);
        
        const info = await transporter.sendMail({
            from: `"Quran Circle Team" <${senderEmail}>`, // sender address
            to: toEmail, // list of receivers
            subject: subject, // Subject line
            html: htmlContent, // html body
        });

        // The 'info' object contains details like messageId and response
        console.log(`Message sent successfully. Message ID: ${info.messageId}`);
        console.log(`Server response: ${info.response}`);

        return { success: true };

    } catch (error) {
        console.error(`❌ ERROR sending email to ${toEmail}:`, error);
        
        // Return success: false along with the error detail for logging
        return { success: false, errorDetail: error instanceof Error ? error.message : "Unknown SMTP Error" };
    }
}