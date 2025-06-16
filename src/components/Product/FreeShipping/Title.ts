import styled from "styled-components"

const Title = styled.span`
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "var(--black)")};
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 21px;
  letter-spacing: 0.61px;
  margin-left: 10px;
`
export default Title
