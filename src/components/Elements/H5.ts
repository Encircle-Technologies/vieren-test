import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

export const H5 = styled(motion.h5)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "#767676"};
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 30px;
  letter-spacing: 0.61px;
  text-align: ${({ align }) => align?.mobile || "left"};
  text-transform: uppercase;
  margin: 0;

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "#767676"};
    font-size: 12px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`
