import { builder } from 'server/schema/builder'

const ComfyHistoryItemStatus = builder.simpleObject('ComfyHistoryItemStatus', {
  fields: (t) => ({
    status_str: t.string({ nullable: false }),
    completed: t.boolean({ nullable: false }),
    messages: t.field({
      type: ['Json'],
    }),
  }),
})

export const ComfyHistoryItem = builder.simpleObject('ComfyHistoryItem', {
  fields: (t) => ({
    id: t.id({ nullable: false }),
    prompt: t.field({
      type: 'Json',
    }),
    outputs: t.field({
      type: ['Json'],
    }),
    status: t.field({
      type: ComfyHistoryItemStatus,
      nullable: false,
    }),
    meta: t.field({
      type: 'Json',
    }),
  }),
})
