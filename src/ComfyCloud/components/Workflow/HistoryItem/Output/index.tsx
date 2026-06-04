import {
  ComfyFileWhereUniqueInput,
  useComfyFileContentQuery,
} from 'src/gql/generated'

type ComfyHistoryItemOutputProps = ComfyFileWhereUniqueInput

export const ComfyHistoryItemOutput: React.FC<ComfyHistoryItemOutputProps> = ({
  filename,
  subfolder,
  type,
}) => {
  const response = useComfyFileContentQuery({
    variables: {
      where: {
        filename,
        subfolder,
        type,
      },
    },
    skip: !filename,
  })

  const src = response.data?.comfyFileContent

  return src ? (
    <>
      <img src={src} alt={filename} />
    </>
  ) : null
}
