import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface MetricData {
  event: string;
  duration?: number;
  method?: 'passkey' | 'otp';
  success?: boolean;
  clickCount?: number;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: MetricData = await request.json();

    // ログに記録（本番環境ではVercel Analytics等に送信）
    console.log('[METRIC]', JSON.stringify({
      ...data,
      timestamp: data.timestamp || Date.now(),
    }));

    // 匿名メトリクスとして記録
    // 実装例: Vercel Analytics, Datadog, etc.

    return NextResponse.json({
      success: true,
      recorded: true,
    });
  } catch (error) {
    console.error('Metrics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track metrics' },
      { status: 500 }
    );
  }
}
