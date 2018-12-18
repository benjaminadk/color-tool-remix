import React from 'react'
import styled from 'styled-components'
import getContrastText from '../../lib/getContrastColor'

const Item = styled.div`
  height: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 50px;
  font-family: 'Inconsolata';
  .left {
    display: grid;
    align-items: center;
    font-size: 1.3rem;
    text-align: center;
    background: ${props => props.color};
    color: ${props => getContrastText(props.hsl)};
    padding: 0rem 0.75rem;
  }
  .right {
    input {
      font-size: 1.3rem;
      font-family: 'Inconsolata';
      padding: 0.75rem 1rem;
    }
  }
`

export default ({ color, name, hsl }) => {
  return (
    <Item color={color} hsl={hsl}>
      <div className="left">{color}</div>
      <div className="right">
        <input type="text" value={name} readOnly />
      </div>
    </Item>
  )
}
