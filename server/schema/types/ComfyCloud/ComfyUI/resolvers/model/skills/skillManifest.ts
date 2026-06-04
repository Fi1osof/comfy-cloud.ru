import { readFileSync } from 'fs'
import { join } from 'path'
import { SkillManifest } from 'server/schema/types/Skills/interfaces'
import { renderTemplate } from 'server/schema/types/Skills/renderTemplate'
import { getAllModels } from '../../helpers/getAllModels'

const template = readFileSync(join(__dirname, 'content.md'), 'utf-8')

export const skillManifest: SkillManifest = {
  name: 'Comfy models',
  description: readFileSync(join(__dirname, 'description.md'), 'utf-8'),
  buildContent: async () => {
    const modelsByCategory = await getAllModels()

    let modelsContent = ''
    for (const { category, models } of modelsByCategory) {
      modelsContent += `## ${category}\n\n`
      for (const model of models) {
        modelsContent += `- ${model.name}\n`
      }
      modelsContent += '\n'
    }

    return renderTemplate(template, { models: modelsContent })
  },
  files: [],
}
