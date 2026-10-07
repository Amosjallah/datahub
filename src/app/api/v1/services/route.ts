import { NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/apiKeyAuth';

export const allServices = [
  // MTN Data Bundles (Non-Expiry)
  { id: 'MTN_1GB', name: 'MTN Data 1GB', type: 'data', network: 'MTN', volume: '1GB', retail_price: 4.20, agent_price: 3.80, api_price: 3.60, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_2GB', name: 'MTN Data 2GB', type: 'data', network: 'MTN', volume: '2GB', retail_price: 9.00, agent_price: 8.20, api_price: 7.90, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_3GB', name: 'MTN Data 3GB', type: 'data', network: 'MTN', volume: '3GB', retail_price: 13.50, agent_price: 12.30, api_price: 11.90, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_4GB', name: 'MTN Data 4GB', type: 'data', network: 'MTN', volume: '4GB', retail_price: 19.00, agent_price: 17.20, api_price: 16.80, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_5GB', name: 'MTN Data 5GB', type: 'data', network: 'MTN', volume: '5GB', retail_price: 23.00, agent_price: 21.00, api_price: 20.20, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_6GB', name: 'MTN Data 6GB', type: 'data', network: 'MTN', volume: '6GB', retail_price: 27.00, agent_price: 24.80, api_price: 24.00, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_8GB', name: 'MTN Data 8GB', type: 'data', network: 'MTN', volume: '8GB', retail_price: 36.00, agent_price: 33.00, api_price: 32.00, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_10GB', name: 'MTN Data 10GB', type: 'data', network: 'MTN', volume: '10GB', retail_price: 43.00, agent_price: 39.50, api_price: 38.00, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_15GB', name: 'MTN Data 15GB', type: 'data', network: 'MTN', volume: '15GB', retail_price: 62.00, agent_price: 57.00, api_price: 55.00, validity: 'Non-Expiry', status: 'available' },
  { id: 'MTN_20GB', name: 'MTN Data 20GB', type: 'data', network: 'MTN', volume: '20GB', retail_price: 82.00, agent_price: 76.00, api_price: 73.50, validity: 'Non-Expiry', status: 'available' },

  // Telecel Data Bundles
  { id: 'TEL_1GB', name: 'Telecel Data 1GB', type: 'data', network: 'Telecel', volume: '1GB', retail_price: 4.00, agent_price: 3.60, api_price: 3.50, validity: 'Non-Expiry', status: 'available' },
  { id: 'TEL_2GB', name: 'Telecel Data 2GB', type: 'data', network: 'Telecel', volume: '2GB', retail_price: 8.50, agent_price: 7.70, api_price: 7.40, validity: 'Non-Expiry', status: 'available' },
  { id: 'TEL_5GB', name: 'Telecel Data 5GB', type: 'data', network: 'Telecel', volume: '5GB', retail_price: 20.00, agent_price: 18.00, api_price: 17.50, validity: 'Non-Expiry', status: 'available' },
  { id: 'TEL_10GB', name: 'Telecel Data 10GB', type: 'data', network: 'Telecel', volume: '10GB', retail_price: 38.50, agent_price: 35.00, api_price: 34.00, validity: 'Non-Expiry', status: 'available' },

  // AirtelTigo Data Bundles
  { id: 'AT_1GB', name: 'AirtelTigo Data 1GB', type: 'data', network: 'AirtelTigo', volume: '1GB', retail_price: 4.00, agent_price: 3.50, api_price: 3.40, validity: 'Non-Expiry', status: 'available' },
  { id: 'AT_2GB', name: 'AirtelTigo Data 2GB', type: 'data', network: 'AirtelTigo', volume: '2GB', retail_price: 8.50, agent_price: 7.50, api_price: 7.20, validity: 'Non-Expiry', status: 'available' },
  { id: 'AT_5GB', name: 'AirtelTigo Data 5GB', type: 'data', network: 'AirtelTigo', volume: '5GB', retail_price: 19.00, agent_price: 17.00, api_price: 16.50, validity: 'Non-Expiry', status: 'available' },
  { id: 'AT_10GB', name: 'AirtelTigo Data 10GB', type: 'data', network: 'AirtelTigo', volume: '10GB', retail_price: 36.00, agent_price: 32.50, api_price: 31.50, validity: 'Non-Expiry', status: 'available' },

  // Airtime Top-Up
  { id: 'AIRTIME_MTN', name: 'MTN Airtime Top-Up', type: 'airtime', network: 'MTN', retail_price: 1.00, agent_price: 0.97, api_price: 0.96, status: 'available' },
  { id: 'AIRTIME_TELECEL', name: 'Telecel Airtime Top-Up', type: 'airtime', network: 'Telecel', retail_price: 1.00, agent_price: 0.97, api_price: 0.96, status: 'available' },
  { id: 'AIRTIME_AT', name: 'AirtelTigo Airtime Top-Up', type: 'airtime', network: 'AirtelTigo', retail_price: 1.00, agent_price: 0.97, api_price: 0.96, status: 'available' },

  // Utility Bills
  { id: 'BILL_ECG', name: 'ECG Prepaid Electricity', type: 'bill', network: 'ECG', retail_price: 0.50, agent_price: 0.30, api_price: 0.25, status: 'available' },
  { id: 'BILL_GWCL', name: 'Ghana Water Company (GWCL)', type: 'bill', network: 'GWCL', retail_price: 0.50, agent_price: 0.30, api_price: 0.25, status: 'available' },

  // Cable TV Subscriptions
  { id: 'TV_DSTV', name: 'DStv Subscription & Renewal', type: 'tv', network: 'DSTV', retail_price: 1.00, agent_price: 0.50, api_price: 0.40, status: 'available' },
  { id: 'TV_GOTV', name: 'GOtv Subscription & Renewal', type: 'tv', network: 'GOTV', retail_price: 1.00, agent_price: 0.50, api_price: 0.40, status: 'available' },
  { id: 'TV_STARTIMES', name: 'StarTimes Subscription', type: 'tv', network: 'STARTIMES', retail_price: 1.00, agent_price: 0.50, api_price: 0.40, status: 'available' },
];

export async function GET(request: Request) {
  // Public or API Key authenticated
  const auth = await authenticateApiKey(request);
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type');
  const networkFilter = searchParams.get('network');

  let filtered = allServices;
  if (typeFilter) {
    filtered = filtered.filter(s => s.type.toLowerCase() === typeFilter.toLowerCase());
  }
  if (networkFilter) {
    filtered = filtered.filter(s => s.network.toLowerCase() === networkFilter.toLowerCase());
  }

  return NextResponse.json({
    status: 'success',
    count: filtered.length,
    authenticated: auth.authenticated,
    data: filtered,
  });
}
