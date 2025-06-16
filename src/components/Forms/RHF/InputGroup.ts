import styled from "styled-components"

export const InputGroup = styled.div`
  min-height: 50px;
  margin-bottom: 10px;
  width: 100%;
`

export const InlineInputGroup = styled.div`
  min-height: 55px;
  margin-bottom: 10px;
  width: 100%;
`

export const InlineSplitInputGroup = styled(InlineInputGroup)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
  place-content: start center;

  & > * {
    margin-bottom: 0;
  }
`

export const InlineThirdsInputGroup = styled(InlineSplitInputGroup)`
  grid-template-columns: 1fr 1fr 1fr;
  gap: 21px;

  & > * {
    margin-bottom: 0;
  }
`
