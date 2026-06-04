export const COMFY_UI_API_ENDPOINT = process.env.COMFY_UI_API_ENDPOINT

function getComfyApiUrl(path: string): string {
  if (!COMFY_UI_API_ENDPOINT) {
    throw new Error('COMFY_UI_API_ENDPOINT env is empty')
  }

  return `${COMFY_UI_API_ENDPOINT}/${path}`
}

export function comfyApiRequest(path: string, params: RequestInit) {
  return fetch(getComfyApiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...params,
  })
}
