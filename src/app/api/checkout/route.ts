import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, items, subtotal, deliveryFee, total, paymentReference, orderNumber: requestedOrderNumber, status: requestedStatus } = body;

    const db = getAdminDb();
    
    // Save order to Firestore
    const orderNumber = requestedOrderNumber || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const status = requestedStatus || (paymentReference ? 'paid' : 'Pending WhatsApp');
    
    const docRef = await db.collection("orders").add({
      orderNumber,
      customerName: name,
      email: email,
      phone: phone,
      address: address,
      items: items,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      status: status,
      paymentReference: paymentReference || null,
      createdAt: new Date().toISOString()
    });

    // Send email to admin
    await sendEmail({
      to: 'info@pburns.com',
      subject: `New Order [${status}] - ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #111; font-family: serif;">New Order Received</h1>
          <p style="color: #555;">An order has been created with status: ${status}.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Customer:</strong> ${name} (${email})</p>
          <p><strong>Total Amount:</strong> GH₵ ${total.toFixed(2)}</p>
          <p><strong>Payment Ref:</strong> ${paymentReference || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; text-align: center; font-size: 12px;">P-Burns Enterprise</p>
        </div>
      `
    });

    // Send email to customer if paid
    if (status === 'paid') {
      await sendEmail({
        to: email,
        subject: 'Order Confirmed - P-Burns Enterprise',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h1 style="color: #111; font-family: serif;">Thank You for Your Order!</h1>
            <p style="color: #555;">Dear ${name},</p>
            <p style="color: #555;">Your payment was successful and your order <strong>${orderNumber}</strong> has been confirmed.</p>
            <p style="color: #555;">We will process it immediately and contact you regarding delivery.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #888; text-align: center; font-size: 12px;">P-Burns Enterprise</p>
          </div>
        `
      });

      // Send SMS to customer
      if (phone) {
        await sendSMS({
          to: phone,
          message: `Hello ${name}, thank you for your order! Your order ${orderNumber} has been confirmed. Total: GH₵ ${total.toFixed(2)}. P-Burns Enterprise.`
        });
      }
    }

    return NextResponse.json({ success: true, orderId: docRef.id });
  } catch (error) {
    console.error("Error in checkout API:", error);
    return NextResponse.json({ success: false, error: 'Failed to process checkout' }, { status: 500 });
  }
}
