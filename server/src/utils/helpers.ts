export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getNightCount(fromDate: string, toDate: string): number {
  const from = parseDate(fromDate);
  const to = parseDate(toDate);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error || ""
    );
  },
  debug: (message: string, data?: any) => {
    if (process.env.DEBUG) {
      console.log(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        data || ""
      );
    }
  },
};
