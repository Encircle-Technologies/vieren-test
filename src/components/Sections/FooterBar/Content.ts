import styled from "styled-components"

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: clamp(80px, 10.42vw, 180px);
  }

  @media (min-width: 1280px) {
    gap: clamp(180px, 14vw, 250px);
  }
`

export default Content
