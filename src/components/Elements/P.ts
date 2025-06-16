import styled from "styled-components"
import { motion } from "framer-motion"
import { TypographyProps } from "./Typography"

export const P = styled(motion.div)<TypographyProps>`
  color: ${({ colour }) => colour?.mobile || "var(--gray)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 1px;
  line-height: 24px;
  text-align: ${({ align }) => align?.mobile || "left"};

  & > *:last-child {
    margin-bottom: 0;
  }

  & > a {
    font-weight: 700;
  }

  & > a.shortcode-styled-link {
    font-weight: inherit;
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    color: ${({ colour }) => colour?.desktop || "var(--gray)"};
    font-size: 16px;
    line-height: 26px;
    text-align: ${({ align }) => align?.desktop || "left"};
  }

  p {
    margin: 0 0 20px;
  }
`
