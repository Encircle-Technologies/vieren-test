import styled from "styled-components"

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(343px, 22fr) 1fr;

  @media (min-width: 800px) {
    grid-template-columns: 1fr 28fr 1fr;
  }

  > * {
    grid-column: 2 / 3;
  }
`

export default Grid
