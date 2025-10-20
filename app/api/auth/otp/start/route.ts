import { NextRequest, NextResponse } from 'next/server';
import { twilioClient, VERIFY_SERVICE_SID } from '@/lib/twilio';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, channel } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const verification = await twilioClient.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: channel || 'sms',
        customMessage: '[デモ] 認証コード: {####}',
      });

    return NextResponse.json({
      success: true,
      status: verification.status,
      to: verification.to,
    });
  } catch (error) {
    console.error('OTP start error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
