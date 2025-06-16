import React from "react"
import { Link as GatsbyLink } from "gatsby"
import styled from "styled-components"

// Since DOM elements <a> cannot receive activeClassName
// and partiallyActive, destructure the prop here and
// pass it only to GatsbyLink
const Link = ({
  className,
  children,
  to,
  activeClassName,
  partiallyActive,
  ...other
}) => {
  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /^\/(?!\/)/.test(to)
  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <GatsbyLink
        className={className}
        to={to}
        activeClassName={activeClassName}
        partiallyActive={partiallyActive}
        {...other}
      >
        {children}
      </GatsbyLink>
    )
  }
  return (
    <a className={className} href={to} {...other}>
      {children}
    </a>
  )
}
export default Link

export const LinkAsLink = styled(Link)`
  color: ${({ light }) => (light ? "var(--black)" : "var(--white)")};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.75px;
  padding: 0;
  position: relative;

  &::after {
    border-bottom: ${({ light }) =>
      light ? "1px solid var(--black)" : "1px solid var(--white)"};
    content: "";
    display: block;

    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0;
    transition: width 0.5s ease-in;
  }

  &:focus {
    outline: none;
  }

  &:hover::after,
  &:active::after,
  &:focus::after {
    width: 100%;
  }
`

export const LinkAsButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  color: ${({ light }) => (light ? "var(--black)" : "var(--white)")};
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.75px;
  padding: 0;
  position: relative;

  &::after {
    border-bottom: ${({ light }) =>
      light ? "1px solid var(--black)" : "1px solid var(--white)"};
    content: "";
    display: block;

    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0;
    transition: width 0.5s ease-in;
  }

  &:focus {
    outline: none;
  }

  &:hover::after,
  &:active::after,
  &:focus::after {
    width: 100%;
  }
`
