// A simple service to interact with the Telegram Bot API

const BOT_TOKEN = '7957354100:AAFJt03X1B3pqJKip8MmpuYtpUTQZ34dhb0';
const CHAT_ID = '6022061821';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    text?: string;
    reply_to_message?: {
        message_id: number;
    }
  };
}

interface TelegramResponse<T> {
    ok: boolean;
    result: T;
}

// Function to send a message
export async function sendMessage(text: string): Promise<TelegramResponse<{message_id: number}>> {
  const url = `${API_URL}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
      }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
}

// Function to get updates
// NOTE: In a production app, you'd manage the `offset` to avoid processing the same update multiple times.
// For this simple case, we'll fetch recent updates and filter them.
export async function getUpdates(offset?: number): Promise<TelegramResponse<TelegramUpdate[]>> {
  const url = `${API_URL}/getUpdates${offset ? `?offset=${offset}`: ''}`;
   try {
    const response = await fetch(url, {
      method: 'GET',
      // Caching disabled to ensure we always get the latest updates
      cache: 'no-store', 
    });
     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to get Telegram updates:', error);
    throw error;
  }
}
