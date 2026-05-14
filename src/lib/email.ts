import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  let apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    try {
      const settingsSnap = await getDoc(doc(db, "settings", "general"));
      if (settingsSnap.exists()) {
        apiKey = settingsSnap.data().resendApiKey || '';
      }
    } catch (error) {
      console.error("Error fetching email settings:", error);
    }
  }

  if (!apiKey) {
    console.warn("Resend API Key is not set. Skipping email send.");
    return null;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'P-Burns Enterprise <noreply@pburns.com>',
        to: [to],
        subject: subject,
        html: html
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    return null;
  }
}
