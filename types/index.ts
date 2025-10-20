export interface AuthChallenge {
  challengeId: string;
  publicKey: {
    challenge: string;
    timeout?: number;
    rpId?: string;
    allowCredentials?: Array<{
      id: string;
      type: string;
    }>;
  };
}

export interface AuthVerifyRequest {
  challengeId: string;
  credential: {
    id: string;
    rawId: string;
    response: {
      clientDataJSON: string;
      authenticatorData: string;
      signature: string;
      userHandle?: string;
    };
    type: string;
  };
}

export interface LoginMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  clickCount: number;
  method: 'passkey' | 'otp';
  success: boolean;
}

export interface ComparisonData {
  passkey: {
    steps: number;
    clicks: number;
    avgTime: number;
  };
  traditional: {
    steps: number;
    clicks: number;
    avgTime: number;
  };
}
