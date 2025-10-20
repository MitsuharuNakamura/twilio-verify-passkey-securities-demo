import { Twilio } from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('Twilio credentials are not configured');
}

export const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || '';
export const VERIFY_PASSKEY_SERVICE_SID = process.env.TWILIO_VERIFY_PASSKEY_SERVICE_SID || '';
