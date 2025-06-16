import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

export const Blockquote = styled(motion.blockquote)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--gray)"};
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 25px;
  line-height: 34px;
  letter-spacing: 0.31px;
  margin: 0;
  text-align: ${({ align }) => align?.mobile || "left"};

  p {
    margin: 0 0 20px;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--gray)"};
    font-size: 30px;
    line-height: 39px;
    letter-spacing: 0.39px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`
