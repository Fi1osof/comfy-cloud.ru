import { builder } from 'server/schema/builder'

export const ComfyFile = builder.simpleObject('ComfyFile', {
  fields: (t) => ({
    id: t.string({ nullable: false }),
    filename: t.string({ nullable: false }),
    type: t.string({ nullable: false }),
    subfolder: t.string({ nullable: true }),
  }),
})
