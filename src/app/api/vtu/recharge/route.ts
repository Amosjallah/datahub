import { NextResponse } from 'next/server';
import { VtuTransactionService } from '@/services/VtuTransactionService';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';

const resellerProvider = new ResellerXpressProviderAdapter();
const vtuService = new VtuTransactionService(resellerProvider);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, walletId, serviceId, amount, recipient, network, serviceType, planId } = body;

    if (!userId || !walletId || !amount || !recipient || !network || !serviceType) {
      return NextResponse.json(
        { success: false, message: 'Missing required recharge parameters.' },
        { status: 400 }
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
      return NextResponse.json({
        success: true,
        message: `${network} ${serviceType.toUpperCase()} recharge processed successfully via ResellerXpress!`,
        transactionId: result.transactionId,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: result.errorMessage || 'Recharge failed. Funds have been auto-refunded to your wallet.',
      },
      { status: 400 }
    );
  } catch (error: any) {
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
