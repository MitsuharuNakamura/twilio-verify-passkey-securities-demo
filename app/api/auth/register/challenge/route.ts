import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 },
      );
    }

    const rpID = (process.env.NEXT_PUBLIC_RP_ID || "localhost").trim();
    const rpName = (process.env.NEXT_PUBLIC_RP_NAME || "Passkey Demo").trim();
    const origin = (
      process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000"
    ).trim();

    console.log("[CHALLENGE] RP ID:", rpID);
    console.log("[CHALLENGE] RP Name:", rpName);
    console.log("[CHALLENGE] Origin:", origin);

    // SimpleWebAuthnでWebAuthn登録オプションを生成
    // userIDは一意のバイナリ値である必要がある
    const userIdBuffer = new TextEncoder().encode(userId);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: userIdBuffer,
      userName: email,
      userDisplayName: email,
      // チャレンジは自動生成される
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required", // preferredではなくrequiredに変更
        userVerification: "required",
        authenticatorAttachment: "platform",
      },
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
    });

    // チャレンジを一時保存（本番環境ではRedis等を使用）
    // デモ環境ではレスポンスに含めてクライアント側で保持
    return NextResponse.json({
      options,
      userId,
      email,
    });
  } catch (error) {
    console.error("Registration challenge error:", error);
    return NextResponse.json(
      { error: "Failed to create registration challenge" },
      { status: 500 },
    );
  }
}
