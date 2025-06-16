import styled from "styled-components"

const List = styled.ul`
  border-bottom: 1px solid #dedede;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  list-style: none;
  margin: 0;
  padding: 0 0 20px;

  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    justify-content: center;
    overflow-x: unset;
  }
`

export default List
