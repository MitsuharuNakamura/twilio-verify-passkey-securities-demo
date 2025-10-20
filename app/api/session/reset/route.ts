import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Session reset successfully',
    });
  } catch (error) {
    console.error('Session reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset session' },
      { status: 500 }
    );
  }
}
