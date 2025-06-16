import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

const FinePrint = styled(motion.div)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--black)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 11px;
  letter-spacing: 0.61px;
  line-height: 21px;
  text-align: ${({ align }) => align?.mobile || "left"};

  & > *:last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0 0 20px;
  }

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--black)"};
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`

export default FinePrint
