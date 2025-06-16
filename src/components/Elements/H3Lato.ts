import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

const H3Lato = styled(motion.h3)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--gray)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 34px;
  letter-spacing: 0.31px;
  margin: 0 0 10px;
  text-align: ${({ align }) => align?.mobile || "left"};

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--gray)"};
    font-size: 30px;
    letter-spacing: 0.39px;
    line-height: 39px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`

export default H3Lato
