export interface ServiceItem {
  id: string;
  name: string;
  type: 'data' | 'airtime' | 'bill' | 'tv';
  network: string;
  volume?: string;
  capacity?: string;
  supplier_price?: number;
  retail_price: number;
  agent_price: number;
  api_price: number;
  validity?: string;
  status: string;
}

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export const PRICING_MARKUPS = {
  api: 0.05,      // +5%
  agent: 0.10,    // +10%
  customer: 0.20, // +20%
} as const;

export function calculateTierPrices(supplierPrice: number) {
  return {
    supplier_price: round2(supplierPrice),
    api_price: round2(supplierPrice * (1 + PRICING_MARKUPS.api)),
    agent_price: round2(supplierPrice * (1 + PRICING_MARKUPS.agent)),
    retail_price: round2(supplierPrice * (1 + PRICING_MARKUPS.customer)),
  };
}

function buildDataBundle(
  id: string,
  network: 'MTN' | 'Telecel' | 'AirtelTigo',
  gb: number,
  supplierPrice: number
): ServiceItem {
  const volume = `${gb}GB`;
  return {
    id,
    name: `${network} Data ${volume}`,
    type: 'data',
    network,
    volume,
    capacity: String(gb),
    ...calculateTierPrices(supplierPrice),
    validity: 'Non-Expiry',
    status: 'available',
  };
}

const MTN_BUNDLES: Array<[number, number]> = [
  [1, 4.00],
  [2, 8.00],
  [3, 12.00],
  [4, 16.00],
  [5, 20.00],
  [6, 24.00],
  [8, 32.00],
  [10, 39.00],
  [15, 57.00],
  [20, 76.50],
  [25, 96.00],
  [30, 115.00],
  [40, 157.00],
  [50, 185.00],
  [100, 407.00],
];

const TELECEL_BUNDLES: Array<[number, number]> = [
  [5, 19.50],
  [8, 34.64],
  [10, 36.50],
  [12, 43.70],
  [15, 52.85],
  [20, 69.80],
  [25, 86.75],
  [30, 103.70],
  [35, 120.65],
  [40, 137.60],
  [45, 154.55],
  [50, 171.50],
  [100, 341.00],
];

const AIRTELTIGO_BUNDLES: Array<[number, number]> = [
  [1, 3.80],
  [2, 7.60],
  [3, 11.20],
  [4, 15.00],
  [5, 19.00],
  [6, 23.50],
  [8, 30.50],
  [10, 36.50],
  [12, 44.70],
  [15, 55.80],
  [25, 93.00],
  [30, 112.00],
  [40, 151.00],
  [50, 190.00],
];

export const dataServices: ServiceItem[] = [
  ...MTN_BUNDLES.map(([gb, price]) => buildDataBundle(`MTN_${gb}GB`, 'MTN', gb, price)),
  ...TELECEL_BUNDLES.map(([gb, price]) => buildDataBundle(`TEL_${gb}GB`, 'Telecel', gb, price)),
  ...AIRTELTIGO_BUNDLES.map(([gb, price]) => buildDataBundle(`AT_${gb}GB`, 'AirtelTigo', gb, price)),
];

export const allServices: ServiceItem[] = [...dataServices];
