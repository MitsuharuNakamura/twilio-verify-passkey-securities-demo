import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/server/script/deps";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { userId, email, credential, challenge } = await request.json();

    if (!userId || !credential || !challenge) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
    const origin =
      process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

    // SimpleWebAuthnで登録レスポンスを検証
    const verification = await verifyRegistrationResponse({
      response: credential as RegistrationResponseJSON,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        {
          error: `Passkey registration verification failed with status: ${verification.status}`,
        },
        { status: 401 },
      );
    }

    // 本番環境では、verification.registrationInfo をデータベースに保存
    // - credentialID
    // - credentialPublicKey
    // - counter
    // - credentialDeviceType
    // - credentialBackedUp

    // 登録完了後は自動ログインしない（ログイン体験をデモするため）
    // const loginDuration =
    //   Date.now() - parseInt(request.headers.get("x-start-time") || "0");
    // await createSession({
    //   userId,
    //   authenticatedAt: Date.now(),
    //   loginDuration,
    // });

    return NextResponse.json({
      success: true,
      userId,
      registered: true,
      authenticatedAt: Date.now(),
      registrationInfo: {
        credentialID: Buffer.from(
          verification.registrationInfo.credentialID,
        ).toString("base64"),
        credentialPublicKey: Buffer.from(
          verification.registrationInfo.credentialPublicKey,
        ).toString("base64"),
      },
    });
  } catch (error) {
    console.error("Registration verification error:", error);
    return NextResponse.json(
      { error: "Passkey registration verification failed" },
      { status: 500 },
    );
  }
}
