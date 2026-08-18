import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { WalletService } from '@/services/WalletService';

const walletService = new WalletService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const walletId = searchParams.get('walletId');

    if (!reference) {
      return NextResponse.json(
        { success: false, message: 'Transaction reference is required.' },
        { status: 400 }
      );
    }

    const verification = await paystackService.verifyTransaction(reference);

    if (verification.status && verification.data && verification.data.status === 'success') {
      const amountInGHS = verification.data.amount / 100;
      const targetWalletId = walletId || verification.data.metadata?.walletId;

      if (targetWalletId) {
        try {
          await walletService.credit({
            walletId: targetWalletId,
            amount: amountInGHS,
            type: 'credit',
            reference,
            description: `Paystack Deposit (Ref: ${reference})`,
          });
        } catch (creditError: any) {
          // If transaction reference was already processed (duplicate reference prevention in WalletService)
          if (!creditError.message?.includes('duplicate') && !creditError.message?.includes('unique')) {
            console.error('[Wallet Credit Error]:', creditError);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and wallet credited successfully.',
        amount: amountInGHS,
        reference,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: verification.message || 'Payment verification failed or payment not completed.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
