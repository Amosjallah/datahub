import { supabase } from '../lib/supabase';

export interface WalletTransactionPayload {
  walletId: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund' | 'commission' | 'transfer';
  reference: string;
  description?: string;
}

export class WalletService {
  /**
   * Create a new wallet for a user.
   */
  async createWallet(userId: string, currency = 'GHS') {
    const { data, error } = await supabase
      .from('wallets')
      .insert({
        user_id: userId,
        currency,
        cached_balance: 0.0000,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create wallet: ${error.message}`);
    return data;
  }

  /**
   * Credit a wallet. Calls SQL credit_wallet RPC.
   */
  async credit(payload: WalletTransactionPayload) {
    if (payload.amount <= 0) {
      throw new Error('Credit amount must be positive.');
    }

    const { data: transactionId, error } = await supabase.rpc('credit_wallet', {
      p_wallet_id: payload.walletId,
      p_amount: payload.amount,
      p_type: payload.type,
      p_reference: payload.reference,
      p_description: payload.description || null,
    });

    if (error) {
      throw new Error(`Credit transaction failed: ${error.message}`);
    }

    return transactionId;
  }

  /**
   * Debit a wallet. Calls SQL debit_wallet RPC (includes concurrency lock & overdraft protection).
   */
  async debit(payload: WalletTransactionPayload) {
    if (payload.amount <= 0) {
      throw new Error('Debit amount must be positive.');
    }

    const { data: transactionId, error } = await supabase.rpc('debit_wallet', {
      p_wallet_id: payload.walletId,
      p_amount: payload.amount,
      p_type: payload.type,
      p_reference: payload.reference,
      p_description: payload.description || null,
    });

    if (error) {
      throw new Error(`Debit transaction failed: ${error.message}`);
    }

    return transactionId;
  }

  /**
   * Query current balance by summing the actual transactions ledger history.
   * Helps audit/validate cached balances.
   */
  async calculateRealBalance(walletId: string): Promise<number> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('wallet_id', walletId);

    if (error) {
      throw new Error(`Failed to query ledger transactions: ${error.message}`);
    }

    return data.reduce((sum, tx) => sum + Number(tx.amount), 0);
  }
}
