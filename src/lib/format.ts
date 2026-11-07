export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
