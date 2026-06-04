import { builder } from 'server/schema/builder'
import { ComfyFileWhereUniqueInput } from '../inputs'
import { comfyApiRequest } from '../../helpers'

builder.queryField('comfyFileContent', (t) =>
  t.field({
    type: 'String',
    nullable: false,
    args: {
      where: t.arg({
        type: ComfyFileWhereUniqueInput,
        required: true,
      }),
    },
    async resolve(_, { where: { filename, subfolder, type } }) {
      const imageResponse = await comfyApiRequest(
        `view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=${encodeURIComponent(type)}`,
        { method: 'GET' },
      )

      const imageBuffer = await imageResponse.arrayBuffer()
      const base64 = Buffer.from(imageBuffer).toString('base64')

      // TODO Здесь может быть не только изображение
      return `data:image/png;base64,${base64}`
    },
  }),
)
