import styled from "styled-components"

export const Container = styled.section`
  background-color: ${({ theme }) =>
    theme === "dark" ? "#0B0B0B" : "#fafafa"};
`

export const Content = styled.div`
  padding: 0 0 80px;
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: stretch;

    padding: 0;
  }
`

export const InfoContainer = styled.div`
  position: relative; /* for feature overlay to latch onto */
`

export const DetailContainer = styled.div`
  --border: calc(1 / 24 * 100vw);
  padding: 20px var(--border);

  @media (min-width: 1024px) {
    --border: 40px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 100px 0 0;
    padding: 20px var(--border) 0;
  }
  @media (min-width: 1280px) {
    --border: 0px;
    justify-self: center;
    max-width: clamp(400px, 31.25vw, 425px);
    width: 100%;
  }
`
