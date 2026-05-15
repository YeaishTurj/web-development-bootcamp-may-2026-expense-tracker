export function formatCurrency(
  value: number,
  locale = "en-US",
  currency = "USD",
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (e) {
    return `$${value}`;
  }
}
