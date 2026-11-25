/**
 * SMS & Notification Service
 * Hubtel SMS Gateway has been discontinued; notifications are logged/simulated locally
 * unless an alternative SMS gateway is integrated.
 */

interface SendSmsOptions {
  to: string;
  message: string;
  senderId?: string;
}

interface SendSmsResult {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
}

/**
 * Format Ghanaian phone numbers to international E.164 format without '+' (e.g., 233241234567)
 */
export function formatGhanaPhoneForSms(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '233' + cleaned.substring(1);
  } else if (cleaned.startsWith('233') && cleaned.length === 12) {
    // already 233
  }
  return cleaned;
}

export async function sendSms(options: SendSmsOptions): Promise<SendSmsResult> {
  const { to, message, senderId = process.env.SMS_GATEWAY_SENDER_ID || 'QuickNet' } = options;
  const formattedTo = formatGhanaPhoneForSms(to);

  console.log(`[SMS Dispatch] To: ${formattedTo} | Sender: ${senderId} | Msg: ${message}`);
  return {
    success: true,
    status: 'simulated',
    messageId: `SIM_SMS_${Date.now()}`,
  };
}
