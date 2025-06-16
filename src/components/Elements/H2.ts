import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

export const H2 = styled(motion.h2)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--black)"};
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 35px;
  letter-spacing: 2px;
  margin: 0 0 10px;
  text-align: ${({ align }) => align?.mobile || "left"};
  text-transform: uppercase;

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--black)"};
    font-size: 38px;
    letter-spacing: 2.5px;
    line-height: 43px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`
