import styled from "styled-components"
import { H2 } from "../Elements/H2"

export const Name = styled(H2)`
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "var(--black)")};
  margin: 0 0 10px;
  letter-spacing: 2.8px;
`
