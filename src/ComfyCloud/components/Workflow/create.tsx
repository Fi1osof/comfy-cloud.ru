import {} from 'src/components/pages/_App/interfaces'
import {
  ComfyUiWorkflowCreateFormStyled,
  ComfyUiWorkflowCreateGridStyled,
  ComfyUiWorkflowCreateStyled,
} from './styles'
import { Textarea } from 'src/ui-kit/controls/Textarea'
import React, { useCallback, useRef, useState } from 'react'
import { Button } from 'src/ui-kit/Button'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { generateImageWorkflow } from './workflow'
import { useComfyCreateJobMutation } from 'src/gql/generated'
import { ComfyHistoryItem } from './HistoryItem'

const defaultPrompt = JSON.stringify(generateImageWorkflow, null, 2)

export const ComfyUiWorkflowCreate: React.FC = () => {
  const [prompt, promptSetter] = useState(defaultPrompt)
  const [promptId, promptIdSetter] = useState<string>()

  // const [src, srcSetter] = useState<string>()

  const promptRef = useRef(prompt)
  promptRef.current = prompt

  const { addMessage } = useSnackbar() || {}

  const [mutation, { loading }] = useComfyCreateJobMutation()

  const disabled = !prompt || loading

  const onChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      promptSetter(event.currentTarget.value)
    },
    [],
  )

  const onSubmit = useCallback<React.SubmitEventHandler>(
    async (event) => {
      event.preventDefault()

      promptIdSetter(undefined)

      try {
        await mutation({
          variables: {
            workflow: JSON.parse(promptRef.current),
          },
        }).then((r) => {
          const promptId = r.data?.comfyCreateJob?.prompt_id

          if (promptId) {
            promptIdSetter(promptId)
          } else {
            console.error('r.data?.comfyCreateJob', r.data?.comfyCreateJob)

            throw new Error('Empty response')
          }
        })
      } catch (error) {
        addMessage?.(String(error), {
          variant: 'error',
        })
      }
    },
    [addMessage, mutation],
  )

  return (
    <>
      <ComfyUiWorkflowCreateStyled>
        <ComfyUiWorkflowCreateFormStyled onSubmit={onSubmit}>
          <ComfyUiWorkflowCreateGridStyled>
            <Textarea value={prompt} onChange={onChange} disabled={loading} />

            <div>{promptId && <ComfyHistoryItem promptId={promptId} />}</div>
          </ComfyUiWorkflowCreateGridStyled>

          {/* {src && <img src={src} />} */}
          <div>
            <Button type="submit" disabled={disabled}>
              Run workflow
            </Button>
          </div>
        </ComfyUiWorkflowCreateFormStyled>
      </ComfyUiWorkflowCreateStyled>
    </>
  )
}
