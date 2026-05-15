import { getCurrencySymbol } from "./currency";

export function formatCurrency(
  value: number,
  locale = "en-US",
  currency = "BDT",
) {
  try {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value)}`;
  } catch (e) {
    return `${getCurrencySymbol(currency)}${value}`;
  }
}
