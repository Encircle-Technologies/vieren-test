import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

const LargeText = styled(motion.div)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--gray)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 37px;
  letter-spacing: 0.46px;
  line-height: 46px;
  text-align: ${({ align }) => align?.mobile || "left"};

  & > *:last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0 0 20px;
  }

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--gray)"};
    font-size: 45px;
    line-height: 54px;
    letter-spacing: 0.5px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }
`

export default LargeText
