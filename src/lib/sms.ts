/**
 * SMS & Notification Service
 * Sends SMS via Hubtel Ghana SMS Gateway using Hubtel API Credentials.
 * Formats Ghanaian MSISDNs automatically (e.g., 024XXXXXXX -> 23324XXXXXXX).
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

  const clientId = process.env.HUBTEL_CLIENT_ID;
  const clientSecret = process.env.HUBTEL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId.includes('placeholder')) {
    console.log(`[SMS Simulation] To: ${formattedTo} | Sender: ${senderId} | Msg: ${message}`);
    return {
      success: true,
      status: 'simulated',
      messageId: `SIM_SMS_${Date.now()}`,
    };
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Hubtel SMS API v1
    const endpoint = `https://sms.hubtel.com/v1/messages/send?From=${encodeURIComponent(senderId)}&To=${encodeURIComponent(formattedTo)}&Content=${encodeURIComponent(message)}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json().catch(() => null);

    if (response.ok && data && (data.status === 0 || data.status === '0' || data.messageId)) {
      return {
        success: true,
        messageId: data.messageId || String(data.id),
        status: 'delivered',
      };
    }

    // Try JSON POST method as fallback
    const postRes = await fetch('https://sms.hubtel.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        From: senderId,
        To: formattedTo,
        Content: message,
      }),
    });

    const postData = await postRes.json().catch(() => null);
    if (postRes.ok && postData && (postData.status === 0 || postData.status === '0' || postData.messageId)) {
      return {
        success: true,
        messageId: postData.messageId || String(postData.id),
        status: 'delivered',
      };
    }

    console.warn('[Hubtel SMS Warning]:', postData || data || postRes.statusText);
    return {
      success: false,
      error: (data && data.message) || (postData && postData.message) || 'SMS delivery failed',
    };
  } catch (err: any) {
    console.error('[SMS Error]:', err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}
