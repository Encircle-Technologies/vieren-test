import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const Logo = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => (props.width ? props.width : "130px")};

  position: absolute;
  top: ${({ transparentHeader }) => (transparentHeader ? "20px" : "10px")};
  left: 50%;
  transform: translate3d(-50%, 0, 0);

  @media (min-width: 800px) {
    top: 13px;
  }
`

const SiteTitle = styled.h1`
  margin: 0;
`

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const SiteIdentity = ({ children, width, title, transparentHeader }) => {
  return (
    <Logo width={width} transparentHeader={transparentHeader}>
      <Link to="/" aria-label="Return to Home">
        {children}
      </Link>
      <SiteTitle itemProp="headline">
        <ScreenReaderOnly>{title}</ScreenReaderOnly>
      </SiteTitle>
    </Logo>
  )
}

export default SiteIdentity
