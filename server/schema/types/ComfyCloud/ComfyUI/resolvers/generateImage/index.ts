import { builder } from 'server/schema/builder'

import fs from 'fs'
import path from 'path'
import { comfyApiRequest } from '../../helpers'

const ComfyGenerateImageDataInput = builder.inputType(
  'ComfyGenerateImageDataInput',
  {
    fields(t) {
      return {
        prompt: t.string({
          required: true,
        }),
      }
    },
  },
)

const MAX_WAIT_TIME = 1 * 60 * 1000
const POLL_INTERVAL = 2000

builder.mutationField('comfyGenerateImage', (t) =>
  t.field({
    type: 'String',
    nullable: false,
    args: {
      data: t.arg({
        type: ComfyGenerateImageDataInput,
        required: true,
      }),
    },
    async resolve(_, { data: { prompt } }) {
      if (!prompt) {
        throw new Error('Не указано описание картинки')
      }

      const workflow = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../prompt/flows/text_to_image.json'),
          'utf8',
        ),
      )

      workflow['104:90'].inputs.text = prompt

      workflow['104:92'].inputs.seed = Date.now()

      const promptResponse = await comfyApiRequest('prompt', {
        body: JSON.stringify({
          prompt: workflow,
        }),
      })

      const promptData = await promptResponse.json()
      const promptId = promptData.prompt_id

      const startTime = Date.now()

      while (Date.now() - startTime < MAX_WAIT_TIME) {
        const historyResponse = await comfyApiRequest(`history/${promptId}`, {
          method: 'GET',
        })

        const historyData = await historyResponse.json()

        if (historyData[promptId]) {
          const outputs:
            | Partial<{
                60: {
                  images: {
                    filename: string
                    subfolder: string
                    type: string
                  }[]
                }
              }>
            | undefined = historyData[promptId].outputs

          const image = outputs?.[60]?.images?.[0]

          if (!image) {
            throw new Error('No image in outputs')
          }

          const imageResponse = await comfyApiRequest(
            `view?filename=${encodeURIComponent(image.filename)}&subfolder=${encodeURIComponent(image.subfolder)}&type=${encodeURIComponent(image.type)}`,
            { method: 'GET' },
          )

          const imageBuffer = await imageResponse.arrayBuffer()
          const base64 = Buffer.from(imageBuffer).toString('base64')

          return `data:image/png;base64,${base64}`
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
      }

      throw new Error('Timeout: Image generation took too long')
    },
  }),
)
