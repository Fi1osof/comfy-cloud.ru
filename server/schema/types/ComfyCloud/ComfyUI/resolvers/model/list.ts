import { builder } from 'server/schema/builder'
import { getModelsByCategory } from '../helpers/getModelsByCategory'

builder.queryField('comfyModels', (t) =>
  t.field({
    type: 'Json',
    args: {
      category: t.arg.string({ required: true }),
    },
    async resolve(_, { category }) {
      return getModelsByCategory(category)
    },
  }),
)
