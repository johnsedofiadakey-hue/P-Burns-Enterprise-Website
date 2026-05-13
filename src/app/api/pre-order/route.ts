import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, itemToOrder, quantity, description } = body;

    // Send email to admin
    await sendEmail({
      to: 'info@pburns.com', // You can update this to your actual admin email
      subject: `New Pre-Order Request from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #111; font-family: serif;">New Pre-Order Request</h1>
          <p style="color: #555;">You have received a new pre-order request on the website.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Customer Name:</strong> ${name}</p>
          <p><strong>Customer Email:</strong> ${email}</p>
          <p><strong>Item Requested:</strong> ${itemToOrder}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Custom Description:</strong> ${description || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; text-align: center; font-size: 12px;">P-Burns Enterprise</p>
        </div>
      `
    });

    // Send email to customer
    await sendEmail({
      to: email,
      subject: 'Pre-Order Received - P-Burns Enterprise',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #111; font-family: serif;">Thank You for Your Request!</h1>
          <p style="color: #555;">Dear ${name},</p>
          <p style="color: #555;">We have received your pre-order request for <strong>${itemToOrder}</strong>.</p>
          <p style="color: #555;">Our team will review your request and contact you shortly to finalize details and provide pricing.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; text-align: center; font-size: 12px;">P-Burns Enterprise</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in pre-order API:", error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
