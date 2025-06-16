import styled from "styled-components"

export const Collection = styled.span`
  display: block;
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "#767676")};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 30px;
  letter-spacing: 0.61px;
  margin: 0 0 5px;
  text-transform: uppercase;

  @media (min-width: 800px) {
    font-size: 12px;
    line-height: 30px;
    letter-spacing: 0.67px;
  }
`
