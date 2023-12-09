const formatter = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
})

export const dateFormat = (date: number) => {
  const dateObj = new Date(date)
  return formatter.format(dateObj)
}
