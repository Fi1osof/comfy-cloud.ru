import { comfyApiRequest } from '../../helpers'

export async function getModelsCategories(): Promise<string[]> {
  const result = await comfyApiRequest('models', {
    method: 'GET',
  }).then((r) => r.json())

  return result
}
