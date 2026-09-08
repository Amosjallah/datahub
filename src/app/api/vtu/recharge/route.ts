import { NextResponse } from 'next/server';
import { VtuTransactionService } from '@/services/VtuTransactionService';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const resellerProvider = new ResellerXpressProviderAdapter();
const vtuService = new VtuTransactionService(resellerProvider);

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

    if (serviceType === 'airtime') {
      return NextResponse.json(
        {
          success: false,
          message: 'ResellerXpress is currently configured for Data Bundles only. Airtime VTU is not supported on this provider.',
        },
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
      serviceId: serviceId || 'RESELLERXPRESS_VTU',
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
        message: isProcessing
          ? `${network} DATA order for ${recipient} placed successfully and is being dispatched!`
          : `${network} DATA recharge completed successfully!`,
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
    const plans = await resellerProvider.getPlans();
    const balanceInfo = await resellerProvider.getWalletBalance();
    return NextResponse.json({
      success: true,
      provider: 'ResellerXpress',
      plans,
      upstreamBalance: balanceInfo,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch VTU plans' },
      { status: 500 }
    );
  }
}
