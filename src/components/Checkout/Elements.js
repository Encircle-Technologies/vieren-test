import styled from "styled-components"

export const SectionTitle = styled.h2`
  color: var(--black);
  font-family: "vieren-type-regular", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 2.5px;
  margin: 0 0 50px;
  text-align: center;
  text-transform: uppercase;

  @media (min-width: 1024px) {
    text-align: left;
  }
`

export const SubsectionTitle = styled.h3`
  color: var(--black);
  font-family: "vieren-type-regular", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 1px;
  margin: 0 0 20px;
  text-transform: uppercase;
`
