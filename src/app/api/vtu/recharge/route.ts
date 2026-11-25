import { NextResponse } from 'next/server';
import { VtuTransactionService } from '@/services/VtuTransactionService';
import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const datamartProvider = new DatamartGHProviderAdapter();
const vtuService = new VtuTransactionService(datamartProvider);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, walletId, serviceId, amount, recipient, network, serviceType, planId, capacity, reference } = body;

    if (!amount || !recipient || !network || !serviceType) {
      return NextResponse.json(
        { success: false, message: 'Missing required recharge parameters: amount, recipient, network, serviceType.' },
        { status: 400 }
      );
    }

    if (String(serviceType).toLowerCase() !== 'data') {
      return NextResponse.json(
        { success: false, message: 'Only DatamartGH data bundles are currently active.' },
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

    const maskedPhone = recipient.length > 5
      ? `${recipient.substring(0, 3)}****${recipient.substring(recipient.length - 3)}`
      : '***';
    console.log(`[VTU Recharge Route] Processing DatamartGH recharge for ${maskedPhone} network=${network} type=${serviceType} amount=${amount}`);

    const result = await vtuService.processTransaction({
      userId,
      walletId,
      serviceId: serviceId || 'DATAMARTGH_VTU',
      amount: Number(amount),
      recipient,
      network,
      serviceType,
      planId,
      capacity,
      reference,
    });

    if (result.success) {
      const isProcessing = result.status === 'processing';
      return NextResponse.json({
        success: true,
        status: result.status || 'processing',
        provider: 'DatamartGH',
        message: isProcessing
          ? `${network} ${serviceType.toUpperCase()} order for ${recipient} placed via DatamartGH and is being dispatched!`
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
    console.error('[VTU Recharge Error]:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error processing VTU recharge' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [datamartPlans, datamartBalance] = await Promise.allSettled([
      datamartProvider.getPlans(),
      datamartProvider.getWalletBalance(),
    ]);

    const dmPlansList = datamartPlans.status === 'fulfilled' ? datamartPlans.value : [];
    const activePlans = dmPlansList.map((p) => ({
      ...p,
      price: p.retailPrice, // Customer retail price (+20%)
    }));

    return NextResponse.json({
      success: true,
      plans: activePlans,
      providers: {
        datamartGH: {
          plans: activePlans,
          balance: datamartBalance.status === 'fulfilled' ? datamartBalance.value : null,
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
