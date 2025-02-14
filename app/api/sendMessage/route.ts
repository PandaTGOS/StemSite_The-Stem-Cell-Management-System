import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  const { phoneNumbers, message } = await request.json();

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const results = await Promise.all(
      phoneNumbers.map(async (phoneNumber: string) => {
        return client.messages.create({
          body: message,
          from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
          to: `whatsapp:${phoneNumber}`,
        });
      })
    );

    console.log(`Sent ${results.length} messages successfully`);
    return NextResponse.json({ message: `Sent ${results.length} messages successfully` });
  } catch (error) {
    console.error('Error sending messages:', error);
    return NextResponse.json({ message: 'Error sending messages' }, { status: 500 });
  }
}