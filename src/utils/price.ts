export function formatVariablePrice(price: string) {
  if (!price) return
  const prices = price.split(" - ")
  return prices[0]
}
