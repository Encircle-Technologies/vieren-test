import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

const H2Lato = styled(motion.h2)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--gray)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 30px;
  line-height: 39px;
  letter-spacing: 0.38px;
  margin: 0 0 10px;
  text-align: ${({ align }) => align?.mobile || "left"};

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--gray)"};
    font-size: 38px;
    letter-spacing: 0.49px;
    line-height: 47px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`
export default H2Lato
