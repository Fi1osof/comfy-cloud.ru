import { builder } from 'server/schema/builder'
import { comfyApiRequest } from '../../helpers'
import { ComfyHistoryItem } from '../types'

builder.queryField('comfyHistoryItem', (t) =>
  t.field({
    type: ComfyHistoryItem,
    args: {
      promptId: t.arg.id({ required: true }),
    },
    async resolve(_, { promptId }) {
      const response: null | Record<
        string,
        {
          meta: Record<
            string,
            {
              node_id: string
              display_node: string
              parent_node: unknown | null
              real_node_id: string
            }
          >
          status: {
            status_str: string
            completed: boolean
            messages: unknown[]
          }
          outputs: Record<string, unknown>
        }
      > = await comfyApiRequest(`history/${promptId}`, {
        method: 'GET',
      }).then((r) => r.json())

      // eslint-disable-next-line no-console
      console.log('response', response)

      if (!response) {
        return null
      }

      const [id, item] = Object.entries(response)[0] || []

      if (!item) {
        return null
      }

      const { outputs, ...other } = item

      return {
        id,
        ...other,
        outputs:
          outputs &&
          Object.entries(outputs).map(([nodeId, node]) => {
            return {
              nodeId,
              ...(node || {}),
            }
          }),
      }
    },
  }),
)
