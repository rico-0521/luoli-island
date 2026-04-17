export type ApiEnvelope<T> = {
  status: number
  data: T
  msg?: string
  message?: string
}

type PostJsonOptions = {
  headers?: Record<string, string>
  signal?: AbortSignal
  credentials?: RequestCredentials
}

export async function postJson<T>(
  path: string,
  body: unknown = {},
  opts: PostJsonOptions = {},
): Promise<ApiEnvelope<T>> {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
    },
    body: JSON.stringify(body ?? {}),
    credentials: opts.credentials ?? 'include',
    signal: opts.signal,
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const json = (await res.json()) as ApiEnvelope<T>
  return json
}

