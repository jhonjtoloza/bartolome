const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0
})
export const currencyFormat = (value: number) => {
  return formatter.format(value)
}
