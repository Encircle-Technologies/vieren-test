import styled from "styled-components"

const Link = styled.a`
  position: relative;

  color: #767676;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.67px;
  text-transform: uppercase;

  &.active {
    color: var(--black);
  }

  &::after {
    border-bottom: 1px solid #767676;
    content: "";
    display: block;

    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0;
    transition: width 0.5s ease-in;
  }

  &:hover::after,
  &:focus::after,
  &.active::after {
    width: 100%;
  }

  &.active::after {
    border-bottom: 1px solid var(--black);
  }
`

export default Link
