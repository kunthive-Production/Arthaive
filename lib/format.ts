import { LAKHS_PER_CRORE } from "@/lib/constants"

export function lakhsToCrores(lakhs: number): number {
  return lakhs / LAKHS_PER_CRORE
}

export function croresToLakhs(crores: number): number {
  return crores * LAKHS_PER_CRORE
}

export function usdToInr(usd: number, rate = 84.5): number {
  return usd * rate
}

export function inrToUsd(inr: number, rate = 84.5): number {
  return inr / rate
}

export function formatCurrency(amount: number, currency: "INR" | "USD" = "INR"): string {
  if (currency === "USD") {
    return amount >= 1 ? `$${amount.toFixed(1)}M` : `$${(amount * 1000).toFixed(0)}K`
  }
  const crores = amount / 100
  if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}B`
  if (crores >= 1) return `₹${crores.toFixed(1)}Cr`
  return `₹${amount.toFixed(0)}L`
}
