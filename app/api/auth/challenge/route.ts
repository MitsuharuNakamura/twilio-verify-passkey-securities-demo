import { NextRequest, NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { userId, credentialID } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    console.log("[AUTH CHALLENGE] Generating challenge for userId:", userId);
    console.log("[AUTH CHALLENGE] credentialID:", credentialID);

    const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";

    // allowCredentialsを空にして、ブラウザに自動的にパスキーを見つけさせる
    // これにより、Discoverable Credential (Resident Key) が使用される
    console.log(
      "[AUTH CHALLENGE] Using discoverable credentials (no allowCredentials)",
    );

    // SimpleWebAuthnで認証オプションを生成
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "required",
    });

    console.log("[AUTH CHALLENGE] Options generated successfully");

    return NextResponse.json({
      options,
      userId,
    });
  } catch (error) {
    console.error("[AUTH CHALLENGE] Error:", error);
    return NextResponse.json(
      { error: "Failed to create authentication challenge" },
      { status: 500 },
    );
  }
}
