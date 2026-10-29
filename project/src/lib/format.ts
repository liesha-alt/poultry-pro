export function formatPrice(price: number, currency = '₹'): string {
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(price);
  return `${currency}${formatted}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}
