import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

export const H3 = styled(motion.h3)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--black)"};
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  line-height: 30px;
  letter-spacing: 1.25px;
  margin: 0 0 10px;
  text-align: ${({ align }) => align?.mobile || "left"};
  text-transform: uppercase;

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--black)"};
    font-size: 30px;
    letter-spacing: 1.5px;
    line-height: 35px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`
