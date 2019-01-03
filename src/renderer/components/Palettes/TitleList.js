import React from 'react'
import styled from 'styled-components'

export const List = styled.div`
  display: grid;
  grid-template-rows: 5px repeat(auto-fit, 30px);
`

export const ListItem = styled.p`
  width: 170px;
  height: 30px;
  display: grid;
  align-items: center;
  font-size: 1.25rem;
  margin: 0;
  padding: 0rem 1rem;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
  background: ${props => (props.selected ? props.theme.white : 'transparent')};
  color: ${props => props.theme.black};
  border: ${props => (props.selected ? props.theme.border : 'none')};
  box-shadow: ${props => props.theme.shadows[props.selected ? 1 : 0]};
`

export default ({ palettes, index, setIndex }) => (
  <List>
    <span />
    {palettes.map((p, i) => (
      <ListItem key={p.name} selected={index === i} onClick={() => setIndex(i)}>
        {p.name}
      </ListItem>
    ))}
  </List>
)
