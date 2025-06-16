import styled from "styled-components"
import { P } from "../Elements/P"

const Description = styled(P)`
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "var(--gray)")};
  margin: 40px 0 0;
`

export default Description
