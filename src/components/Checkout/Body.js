import styled from "styled-components"

export const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "form"
    "summary"
    "submit";

  min-height: 100vh;

  @media (min-width: 1024px) {
    grid-template-areas:
      "form summary"
      "submit summary"
      ".summary";
    grid-template-columns: 5fr 3fr;
    grid-template-rows: max-content;
  }
`
