export function parseHashParams(hash: string = window.location.hash.substring(1)): Map<string, string> {
  const params = new Map<string, string>()

  hash.split('&').forEach((item) => {
    const parts = item.split('=')
    if (parts.length === 2) {
      params.set(parts[0]!, parts[1]!)
    }
  })

  return params
}

export function parseBooleanParam(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue
  }
  return !(value.toLowerCase() === 'false')
}
