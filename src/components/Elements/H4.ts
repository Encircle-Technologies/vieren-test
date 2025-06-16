import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

export const H4 = styled(motion.h4)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--black)"};
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 1px;
  margin: 0 0 10px;
  text-align: ${({ align }) => align?.mobile || "left"};
  text-transform: uppercase;

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--black)"};
    font-size: 22px;
    line-height: 27px;
    letter-spacing: 1px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`
