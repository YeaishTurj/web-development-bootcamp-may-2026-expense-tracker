const EXCHANGE_RATES: Record<string, number> = {
  BDT: 1,
  USD: 121,
  EUR: 132,
  GBP: 154,
  INR: 1.45,
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
) {
  const fromRate = EXCHANGE_RATES[fromCurrency] ?? 1;
  const toRate = EXCHANGE_RATES[toCurrency] ?? 1;
  const amountInBdt = amount * fromRate;

  return amountInBdt / toRate;
}