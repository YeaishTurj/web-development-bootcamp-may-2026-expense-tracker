export const CURRENCIES = [
  { code: "BDT", symbol: "৳", label: "৳ BDT" },
  { code: "USD", symbol: "$", label: "$ USD" },
  { code: "EUR", symbol: "€", label: "€ EUR" },
  { code: "GBP", symbol: "£", label: "£ GBP" },
  { code: "INR", symbol: "₹", label: "₹ INR" },
];

export function getCurrencySymbol(currency: string): string {
  const curr = CURRENCIES.find((c) => c.code === currency);
  return curr?.symbol || "৳";
}

export function getCurrencyLabel(currency: string): string {
  const curr = CURRENCIES.find((c) => c.code === currency);
  return curr?.label || "৳ BDT";
}
