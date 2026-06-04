import { comfyApiRequest } from '../../helpers'

export interface ComfyModel {
  name: string
  pathIndex: number
  modified: number
  created: number
  size: number
}

export async function getModelsByCategory(
  category: string,
): Promise<ComfyModel[]> {
  const result = await comfyApiRequest(`experiment/models/${category}`, {
    method: 'GET',
  }).then((r) => r.json())

  return result
}
