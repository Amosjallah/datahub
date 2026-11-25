import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Airtime top-up is currently unavailable. Only DatamartGH data bundles are active.',
    },
    { status: 503 }
  );
}
