import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

const H4Lato = styled(motion.h4)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--black)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 29px;
  letter-spacing: 0.3px;
  margin: 0 0 10px;
  text-align: ${({ align }) => align?.mobile || "left"};

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--black)"};
    font-size: 22px;
    line-height: 31px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`
export default H4Lato
