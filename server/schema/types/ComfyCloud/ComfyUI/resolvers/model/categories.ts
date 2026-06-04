import { builder } from 'server/schema/builder'
import { getModelsCategories } from '../helpers/getModelsCategories'

builder.queryField('comfyModelsCategories', (t) =>
  t.field({
    type: 'Json',
    async resolve() {
      return getModelsCategories()
    },
  }),
)
