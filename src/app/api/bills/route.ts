import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Utility bill payments are currently unavailable. Hubtel gateway has been discontinued and only DatamartGH data bundles are active.',
    },
    { status: 503 }
  );
}
