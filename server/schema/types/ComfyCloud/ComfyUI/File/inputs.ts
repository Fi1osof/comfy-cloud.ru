import { builder } from 'server/schema/builder'

export const ComfyFileWhereUniqueInput = builder.inputType(
  'ComfyFileWhereUniqueInput',
  {
    fields(t) {
      return {
        filename: t.string({ required: true }),
        subfolder: t.string({ required: true }),
        type: t.string({ required: true }),
      }
    },
  },
)
