import { minWidth } from 'src/theme/helpers'
import styled, { css } from 'styled-components'

export const ComfyUiWorkflowCreateFormStyled = styled.form`
  display: contents;
`

export const ComfyUiWorkflowCreateGridStyled = styled.div`
  flex: 1;

  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  gap: 10px;

  ${minWidth.md(css`
    grid-template-columns: 1fr 1fr;
  `)};
`

export const ComfyUiWorkflowCreateStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  height: 100%;
`
