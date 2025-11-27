import nodemailer from 'nodemailer';

interface InterviewEmailPayload {
  to: string;
  candidateName?: string | null;
  interviewTitle: string;
  scheduledAt: Date;
  expiresAt?: Date;
  hrName?: string | null;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('[mail] SMTP env vars missing; email disabled');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for others
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return transporter;
}

export async function sendInterviewScheduledEmail(payload: InterviewEmailPayload) {
  const transport = getTransporter();
  if (!transport) return false;

  const from = process.env.EMAIL_FROM || 'no-reply@takeint.local';
  const { to, candidateName, interviewTitle, scheduledAt, expiresAt, hrName } = payload;

  const scheduledLocal = scheduledAt.toLocaleString('en-US', { hour12: true });
  const expiresLocal = expiresAt ? expiresAt.toLocaleString('en-US', { hour12: true }) : undefined;

  const subject = `Interview Scheduled: ${interviewTitle}`;
  const lines: string[] = [
    candidateName ? `Hi ${candidateName},` : 'Hello,',
    '',
    `An interview has been scheduled for you by ${hrName || 'HR'}.`,
    `Title: ${interviewTitle}`,
    `Scheduled Time: ${scheduledLocal} (your local timezone)`,
  ];
  if (expiresLocal) {
    lines.push(`Link Expiration: ${expiresLocal}`);
  }
  lines.push('', 'Please log in to the platform to join at the scheduled time.', '', 'Best regards,', 'takeInt Interview Platform');

  try {
    await transport.sendMail({
      from,
      to,
      subject,
      text: lines.join('\n'),
      html: `<p>${lines.map(l => l || '&nbsp;').join('<br/>')}</p>`
    });
    return true;
  } catch (err) {
    console.error('[mail] Failed to send scheduled interview email:', err);
    return false;
  }
}
