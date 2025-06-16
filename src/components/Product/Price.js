import styled from "styled-components"

export const Price = styled.span`
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "var(--black)")};
  display: flex;
  align-items: baseline;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 30px;
  letter-spacing: 0.78px;

  @media (min-width: 800px) {
    font-size: 16px;
    line-height: 30px;
    letter-spacing: 0.89px;
  }
`
