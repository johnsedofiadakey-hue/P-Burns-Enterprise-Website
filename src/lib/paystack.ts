export async function initializeTransaction({ email, amount, callbackUrl }: { email: string; amount: number; callbackUrl: string }) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  
  if (!secretKey) {
    console.warn("PAYSTACK_SECRET_KEY is not set. Skipping transaction initialization.");
    return null;
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        amount: amount * 100, // Amount in pesewas
        callback_url: callbackUrl
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error);
    return null;
  }
}

export async function verifyTransaction(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  
  if (!secretKey) {
    console.warn("PAYSTACK_SECRET_KEY is not set. Skipping transaction verification.");
    return null;
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error);
    return null;
  }
}
