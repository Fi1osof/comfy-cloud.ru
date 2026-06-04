import { getModelsCategories } from './getModelsCategories'
import { getModelsByCategory, type ComfyModel } from './getModelsByCategory'

export interface ModelsByCategory {
  category: string
  models: ComfyModel[]
}

export async function getAllModels(): Promise<ModelsByCategory[]> {
  const categories = await getModelsCategories()

  const results = await Promise.all(
    categories.map(async (category) => ({
      category,
      models: await getModelsByCategory(category),
    })),
  )

  return results
}
