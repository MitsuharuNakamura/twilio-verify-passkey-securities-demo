import { NextRequest, NextResponse } from 'next/server';
import { twilioClient, VERIFY_SERVICE_SID } from '@/lib/twilio';
import { createSession } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code, userId, loginDuration } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    const verificationCheck = await twilioClient.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    if (verificationCheck.status !== 'approved') {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 401 }
      );
    }

    // セッションを作成
    await createSession({
      userId: userId || phoneNumber,
      authenticatedAt: Date.now(),
      loginDuration,
    });

    return NextResponse.json({
      success: true,
      userId: userId || phoneNumber,
      authenticatedAt: Date.now(),
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
