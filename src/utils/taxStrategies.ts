export interface Profile {
  incomeUSD: number;
  status: "single" | "married";
}

export interface TaxSummary {
  percentage: number | undefined;
  link?: string;
  notice?: string;
}

export interface TaxStrategy {
  (profile: Profile, exchangeRates: Record<string, number>): TaxSummary;
}

export interface TaxStrategies {
  [name: string]: TaxStrategy;
}

export function defaultTaxStrategy(notice?: string): TaxSummary {
  return { percentage: undefined, notice };
}

export function progressiveTax(
  scale: Record<number, number>,
  localCurrencyIncome: number
): number {
  let sum = 0;
  let prevLimit = 0;

  for (const [limit, rate] of Object.entries(scale)) {
    const limitNum = Number(limit);
    if (limitNum < localCurrencyIncome) {
      sum += rate * (limitNum - prevLimit);
      prevLimit = limitNum;
    } else {
      sum += (localCurrencyIncome - prevLimit) * rate;
      break;
    }
  }
  return sum;
}
