export function formatUnixTimestamp(unixTimestamp: string): string {
  const date = new Date(Number(unixTimestamp) * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function unixTimestampToDate(unixTimestamp: string): Date {
  return new Date(Number(unixTimestamp) * 1000);
}

export function formatVNDcurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

export function getCurentUnixTimestamp(): string {
  return String(Math.floor(Date.now() / 1000));
}
