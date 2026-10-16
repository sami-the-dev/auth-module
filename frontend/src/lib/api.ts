/** Extracts a human-readable message from an RTK Query error. */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const { status, data } = error as { status: unknown; data?: { message?: unknown } }
    if (status === 'FETCH_ERROR') {
      return "We couldn't reach the server. Please check your connection and try again."
    }
    const message = data?.message
    if (Array.isArray(message)) return message.join('. ')
    if (typeof message === 'string') return message
  }
  return 'Something went wrong on our side. Please try again.'
}
