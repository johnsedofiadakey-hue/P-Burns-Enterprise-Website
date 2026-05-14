import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function sendSMS({ to, message }: { to: string; message: string }) {
  try {
    // Fetch API Key from Firestore
    const settingsSnap = await getDoc(doc(db, "settings", "general"));
    let apiKey = '';
    let senderId = 'PBurns';

    if (settingsSnap.exists()) {
      apiKey = settingsSnap.data().smsApiKey || '';
      senderId = settingsSnap.data().smsSenderId || 'PBurns';
    }

    if (!apiKey) {
      console.warn("SMS API Key is not set. Skipping SMS send.");
      return null;
    }

    // Using Arkesel (Popular in Ghana) as default
    const response = await fetch(`https://sms.arkesel.com/sms/api?action=send-sms&api_key=${apiKey}&to=${to.replace('+', '')}&from=${senderId}&sms=${encodeURIComponent(message)}`, {
      method: 'GET'
    });

    const data = await response.text(); // Arkesel sometimes returns plain text or JSON
    console.log("SMS Response:", data);
    return data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return null;
  }
}
