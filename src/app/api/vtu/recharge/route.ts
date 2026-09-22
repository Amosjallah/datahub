import { NextResponse } from 'next/server';
import { VtuTransactionService } from '@/services/VtuTransactionService';
import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';
import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from '@/services/providers/ProviderAdapterInterface';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Dual VTU Provider — tries DatamartGH first, falls back to ResellerXpress.
 * This ensures maximum uptime for airtime and data recharges.
 */
class DualVtuProvider implements ProviderAdapterInterface {
  private primary: DatamartGHProviderAdapter;
  private fallback: ResellerXpressProviderAdapter;

  constructor() {
    this.primary = new DatamartGHProviderAdapter();
    this.fallback = new ResellerXpressProviderAdapter();
  }

  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    // Try DatamartGH first
    try {
      const result = await this.primary.recharge(request);
      if (result.success || result.status === 'processing') {
        return result;
      }
      console.warn('[DualVtuProvider] DatamartGH failed, falling back to ResellerXpress. Reason:', result.errorMessage);
    } catch (err: any) {
      console.warn('[DualVtuProvider] DatamartGH threw error, falling back. Error:', err.message);
    }

    // Fallback to ResellerXpress (data bundles only — airtime not supported)
    if (request.serviceType === 'data') {
      return this.fallback.recharge(request);
    }

    // Airtime fallback: ResellerXpress doesn't support airtime — return clean error
    return {
      success: false,
      errorMessage: 'Airtime service temporarily unavailable. Please try again shortly.',
      status: 'failed',
    };
  }

  async queryStatus(providerReference: string): Promise<RechargeResponse> {
    // Try DatamartGH first, then ResellerXpress
    try {
      const result = await this.primary.queryStatus(providerReference);
      if (result.status !== 'processing') return result;
    } catch (_) {}

    return this.fallback.queryStatus(providerReference);
  }
}

const dualProvider = new DualVtuProvider();
const datamartProvider = new DatamartGHProviderAdapter();
const vtuService = new VtuTransactionService(dualProvider);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, walletId, serviceId, amount, recipient, network, serviceType, planId } = body;

    if (!amount || !recipient || !network || !serviceType) {
      return NextResponse.json(
        { success: false, message: 'Missing required recharge parameters: amount, recipient, network, serviceType.' },
        { status: 400 }
      );
    }

    // Resolve user & wallet if missing or demo
    if ((!userId || !walletId || userId.includes('DEMO')) && isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          const { data: wallet } = await supabase
            .from('wallets')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (wallet) {
            walletId = wallet.id;
          }
        }
      } catch (authErr) {
        console.warn('[VTU Recharge] Auth resolution notice:', authErr);
      }
    }

    if (!userId || !walletId) {
      return NextResponse.json(
        { success: false, message: 'User authentication and an active wallet are required to perform a recharge.' },
        { status: 401 }
      );
    }

    const result = await vtuService.processTransaction({
      userId,
      walletId,
      serviceId: serviceId || 'DATAMARTGH_VTU',
      amount: Number(amount),
      recipient,
      network,
      serviceType,
      planId: planId ? Number(planId) : undefined,
    });

    if (result.success) {
      const isProcessing = result.status === 'processing';
      return NextResponse.json({
        success: true,
        status: result.status || 'processing',
        provider: 'DatamartGH + ResellerXpress',
        message: isProcessing
          ? `${network} ${serviceType.toUpperCase()} order for ${recipient} placed and is being dispatched!`
          : `${network} ${serviceType.toUpperCase()} recharge completed successfully!`,
        transactionId: result.transactionId,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: result.errorMessage || 'Recharge could not be completed. Any deducted funds have been auto-refunded to your wallet.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[VTU Recharge Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error processing VTU recharge' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [datamartPlans, rxPlans, datamartBalance, rxBalance] = await Promise.allSettled([
      datamartProvider.getPlans(),
      new ResellerXpressProviderAdapter().getPlans(),
      datamartProvider.getWalletBalance(),
      new ResellerXpressProviderAdapter().getWalletBalance(),
    ]);

    return NextResponse.json({
      success: true,
      providers: {
        datamartGH: {
          plans: datamartPlans.status === 'fulfilled' ? datamartPlans.value : [],
          balance: datamartBalance.status === 'fulfilled' ? datamartBalance.value : null,
        },
        resellerXpress: {
          plans: rxPlans.status === 'fulfilled' ? rxPlans.value : [],
          balance: rxBalance.status === 'fulfilled' ? rxBalance.value : null,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch VTU plans' },
      { status: 500 }
    );
  }
}
