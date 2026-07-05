import { supabase } from '../lib/supabase';
import { WalletService } from './WalletService';
import { ProviderAdapterInterface } from './providers/ProviderAdapterInterface';

interface CreateTransactionPayload {
  userId: string;
  walletId: string;
  serviceId: string;
  amount: number;
  recipient: string;
  network: 'MTN' | 'Telecel' | 'AirtelTigo' | 'ECG' | 'GWCL';
  serviceType: 'data' | 'airtime' | 'bill';
}

export class VtuTransactionService {
  private walletService: WalletService;
  private provider: ProviderAdapterInterface;

  constructor(provider: ProviderAdapterInterface) {
    this.walletService = new WalletService();
    this.provider = provider;
  }

  /**
   * Process a VTU recharge from start to finish.
   */
  async processTransaction(payload: CreateTransactionPayload) {
    const reference = `VTU_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 1. Create a pending transaction record
    const { data: record, error: recordError } = await supabase
      .from('transaction_records')
      .insert({
        user_id: payload.userId,
        service_id: payload.serviceId,
        amount: payload.amount,
        recipient: payload.recipient,
        status: 'pending',
      })
      .select()
      .single();

    if (recordError) {
      throw new Error(`Failed to initialize transaction: ${recordError.message}`);
    }

    try {
      // 2. Debit the user's wallet (locks row, throws error if insufficient balance)
      await this.walletService.debit({
        walletId: payload.walletId,
        amount: payload.amount,
        type: 'debit',
        reference,
        description: `VTU Purchase: ${payload.network} ${payload.serviceType} for ${payload.recipient}`,
      });

      // Update record status to processing
      await supabase
        .from('transaction_records')
        .update({ status: 'processing' })
        .eq('id', record.id);

    } catch (debitError: any) {
      // Debit failed (e.g., insufficient balance)
      await supabase
        .from('transaction_records')
        .update({ status: 'failed', provider_reference: debitError.message })
        .eq('id', record.id);
      throw debitError;
    }

    // 3. Call the provider API
    try {
      const response = await this.provider.recharge({
        recipient: payload.recipient,
        amount: payload.amount,
        network: payload.network,
        serviceType: payload.serviceType,
        reference,
      });

      if (response.success && response.status === 'success') {
        // Success: Update record
        await supabase
          .from('transaction_records')
          .update({
            status: 'success',
            provider_reference: response.providerReference,
          })
          .eq('id', record.id);
        
        return { success: true, transactionId: record.id };
      } else {
        // Provider returned failure: Trigger auto-refund
        await this.handleRefund(payload.walletId, payload.amount, reference, record.id, response.errorMessage || 'Provider failure');
        return { success: false, errorMessage: response.errorMessage };
      }
    } catch (providerError: any) {
      // System/Network failure: Trigger auto-refund
      await this.handleRefund(payload.walletId, payload.amount, reference, record.id, providerError.message || 'System error');
      return { success: false, errorMessage: 'System recharge connection timeout. Auto-refunded.' };
    }
  }

  /**
   * Safe ledger refund.
   */
  private async handleRefund(walletId: string, amount: number, reference: string, recordId: string, reason: string) {
    const refundRef = `REFUND_${reference}`;
    
    // Credit back to user wallet
    await this.walletService.credit({
      walletId,
      amount,
      type: 'refund',
      reference: refundRef,
      description: `Refund for failed purchase. Reason: ${reason}`,
    });

    // Mark transaction record as reversed
    await supabase
      .from('transaction_records')
      .update({
        status: 'reversed',
        provider_reference: `Refunded: ${reason}`,
      })
      .eq('id', recordId);
  }
}
