/* eslint-disable no-console */
import {
  // useComfyHistoryItemLazyQuery,
  useComfyHistoryItemQuery,
} from 'src/gql/generated'
import { ComfyHistoryItemStyled, ComfyHistoryItemErrorStyled } from './styles'
// import { useBoolean } from 'src/hooks/useBoolean'
import { useEffect } from 'react'
import { ComfyHistoryItemOutput } from './Output'

type ComfyHistoryItemProps = {
  promptId: string
}

export const ComfyHistoryItem: React.FC<ComfyHistoryItemProps> = ({
  promptId,
  ...other
}) => {
  // const [completed] = useBoolean()

  const response = useComfyHistoryItemQuery({
    variables: {
      promptId,
    },
  })

  const historyItem = response.data?.comfyHistoryItem

  useEffect(() => {
    console.log('useEffect historyItem', historyItem)

    // if (historyItem?.status.completed === true) {
    //   return
    // }

    /**
     * Пока выглядит так, что если ответ получен, то значит джоба отработана
     */
    if (historyItem) {
      return
    }

    const interval = setInterval(response.refetch, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [historyItem, response.refetch])

  console.log('response', response)

  const output = historyItem?.outputs

  const errorMessage = historyItem?.status?.messages?.find(
    (msg): msg is [string, { exception_message?: string }] =>
      Array.isArray(msg) && msg[0] === 'execution_error',
  )?.[1]?.exception_message

  return (
    <ComfyHistoryItemStyled {...other}>
      {errorMessage && (
        <ComfyHistoryItemErrorStyled>
          {errorMessage}
        </ComfyHistoryItemErrorStyled>
      )}
      {output?.map((n) => {
        const images = 'images' in n && n.images

        if (images && Array.isArray(images)) {
          return images.map((nn) => {
            if (!nn || typeof nn !== 'object' || Array.isArray(nn)) {
              return null
            }

            const { filename, subfolder, type } = nn

            if (
              typeof filename === 'string' &&
              typeof subfolder === 'string' &&
              typeof type === 'string'
            ) {
              return (
                <ComfyHistoryItemOutput
                  key={[filename, subfolder, type].join('--')}
                  filename={filename}
                  subfolder={subfolder}
                  type={type}
                />
              )
            }

            return null
          })
        }
      })}
    </ComfyHistoryItemStyled>
  )
}
