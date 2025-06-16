import styled from "styled-components"

const Desktop = styled.div`
  display: none;
  @media (min-width: 800px) {
    display: block;
  }
`

const Mobile = styled.div`
  display: block;
  @media (min-width: 800px) {
    display: none;
  }
`

export { Desktop, Mobile }
