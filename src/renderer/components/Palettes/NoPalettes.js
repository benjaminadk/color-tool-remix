import React from 'react'
import styled from 'styled-components'

const NoPalettes = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  justify-items: center;
  align-items: center;
  p {
    background: white;
    color: ${props => props.theme.black};
    font-size: 3rem;
    font-family: 'Oswald';
    padding: 1rem;
    margin: 0;
    border: ${props => props.theme.border};
  }
  button {
    width: 100px;
    background: white;
    color: ${props => props.theme.black};
    padding: 0.5rem 1rem;
    user-select: none;
    transition: all 0.25s;
    &:hover {
      background: ${props => props.theme.black};
      color: white;
    }
  }
`

export default props => (
  <NoPalettes>
    <p>No Saved Palettes</p>
    <button onClick={() => props.setMode(0)}>Back</button>
  </NoPalettes>
)
