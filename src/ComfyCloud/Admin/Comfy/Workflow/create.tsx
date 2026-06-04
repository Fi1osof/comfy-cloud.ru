import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { ComfyUiWorkflowCreate } from 'src/ComfyCloud/components/Workflow/create'

export const ComfyCloudAdminWorkflowCreatePage: Page = () => {
  return (
    <>
      <SeoHeaders title="ComfyCloud Admin create workflow" noindex nofollow />

      <ComfyUiWorkflowCreate />
    </>
  )
}
