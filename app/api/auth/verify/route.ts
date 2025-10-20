import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server/script/deps";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { userId, credential, challenge, credentialPublicKey, counter } =
      await request.json();

    if (!userId || !credential || !challenge || !credentialPublicKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
    const origin =
      process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

    // Base64からBufferに変換
    const publicKeyBuffer = Buffer.from(credentialPublicKey, "base64");

    // SimpleWebAuthnで認証レスポンスを検証
    const verification = await verifyAuthenticationResponse({
      response: credential as AuthenticationResponseJSON,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(credential.id, "base64url"),
        credentialPublicKey: publicKeyBuffer,
        counter: counter || 0,
      },
    });

    if (!verification.verified) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      );
    }

    // 本番環境では、新しいcounterをデータベースに保存
    // verification.authenticationInfo.newCounter

    const loginDuration =
      Date.now() - parseInt(request.headers.get("x-start-time") || "0");

    // セッションを作成
    await createSession({
      userId,
      authenticatedAt: Date.now(),
      loginDuration,
    });

    return NextResponse.json({
      success: true,
      userId,
      authenticatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Authentication verification failed" },
      { status: 500 },
    );
  }
}
