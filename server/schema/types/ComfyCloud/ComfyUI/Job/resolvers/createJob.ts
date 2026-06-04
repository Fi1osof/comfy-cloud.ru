import { builder } from 'server/schema/builder'

import { comfyApiRequest } from '../../helpers'

const ComfyCreateJobResponse = builder.simpleObject('ComfyCreateJobResponse', {
  fields: (t) => ({
    prompt_id: t.string(),
    error: t.field({
      type: 'Json',
    }),
    node_errors: t.field({
      type: 'Json',
    }),
  }),
})

builder.mutationField('comfyCreateJob', (t) =>
  t.field({
    type: ComfyCreateJobResponse,
    args: {
      workflow: t.arg({
        type: 'Json',
        required: true,
      }),
    },
    async resolve(_, { workflow }) {
      const response = await comfyApiRequest('prompt', {
        body: JSON.stringify({
          prompt: workflow,
        }),
      })

      const data = await response.json()

      return data
    },
  }),
)
