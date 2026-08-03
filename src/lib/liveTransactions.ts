import { supabase } from './supabase';

export interface TransactionEvent {
  id: string;
  name: string;
  network: 'MTN' | 'Telecel' | 'AirtelTigo';
  bundle: string;
  amount: string;
  timestamp: number;
  timeAgo?: string;
  isReal?: boolean;
}

const GHANA_NAMES = [
  'Amos', 'Kwame', 'Abena', 'Kojo', 'Ama', 'Yaw', 'Akosua', 'Kofi', 
  'Esi', 'Adwoa', 'Kwaku', 'Afia', 'Fiifi', 'Baaba', 'Gideon', 'Ebenezer'
];

const SAMPLE_TRANSACTIONS: Omit<TransactionEvent, 'id' | 'timestamp'>[] = [
  { name: 'Amos', network: 'MTN', bundle: '2GB (Non-Expiry)', amount: 'GH₵ 9.00' },
  { name: 'Kwame', network: 'Telecel', bundle: '5GB Monthly', amount: 'GH₵ 22.00' },
  { name: 'Abena', network: 'MTN', bundle: '10GB (Non-Expiry)', amount: 'GH₵ 43.00' },
  { name: 'Kojo', network: 'AirtelTigo', bundle: '1GB Daily', amount: 'GH₵ 4.00' },
  { name: 'Ama', network: 'MTN', bundle: '5GB (Non-Expiry)', amount: 'GH₵ 23.00' },
  { name: 'Yaw', network: 'MTN', bundle: '1GB (Non-Expiry)', amount: 'GH₵ 4.20' },
  { name: 'Akosua', network: 'Telecel', bundle: '10GB (Non-Expiry)', amount: 'GH₵ 38.50' },
  { name: 'Kofi', network: 'MTN', bundle: '20GB (Non-Expiry)', amount: 'GH₵ 82.00' },
];

const EVENT_NAME = 'live-transaction-broadcast';
let channel: any = null;

function getChannel() {
  if (typeof window === 'undefined') return null;
  if (!channel && supabase) {
    try {
      channel = supabase.channel('public:live-transactions');
      channel.subscribe();
    } catch (err) {
      console.warn('Supabase Realtime subscription error:', err);
    }
  }
  return channel;
}

/**
 * Broadcast a real transaction to all connected clients
 */
export function broadcastTransaction(eventData: {
  name: string;
  network: 'MTN' | 'Telecel' | 'AirtelTigo';
  bundle: string;
  amount: string;
}) {
  const transaction: TransactionEvent = {
    id: `trx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...eventData,
    timestamp: Date.now(),
    isReal: true,
  };

  // 1. Broadcast via local window event for current window/tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: transaction }));
  }

  // 2. Broadcast via Supabase Realtime channel if available
  const ch = getChannel();
  if (ch) {
    ch.send({
      type: 'broadcast',
      event: 'new-transaction',
      payload: transaction,
    }).catch(() => {});
  }

  return transaction;
}

/**
 * Subscribe to live transaction events
 */
export function subscribeToTransactions(callback: (tx: TransactionEvent) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleLocalEvent = (e: Event) => {
    const customEvent = e as CustomEvent<TransactionEvent>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  window.addEventListener(EVENT_NAME, handleLocalEvent);

  // Subscribe to Supabase channel broadcast
  const ch = getChannel();
  let supabaseSub: any = null;
  if (ch) {
    supabaseSub = ch.on('broadcast', { event: 'new-transaction' }, (payload: any) => {
      if (payload.payload) {
        callback(payload.payload);
      }
    });
  }

  return () => {
    window.removeEventListener(EVENT_NAME, handleLocalEvent);
    if (supabaseSub && channel) {
      // Clean up Supabase listener
    }
  };
}

/**
 * Generate a realistic simulated transaction
 */
export function generateSimulatedTransaction(): TransactionEvent {
  const name = GHANA_NAMES[Math.floor(Math.random() * GHANA_NAMES.length)];
  const sample = SAMPLE_TRANSACTIONS[Math.floor(Math.random() * SAMPLE_TRANSACTIONS.length)];

  return {
    id: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    network: sample.network,
    bundle: sample.bundle,
    amount: sample.amount,
    timestamp: Date.now(),
    isReal: false,
  };
}
